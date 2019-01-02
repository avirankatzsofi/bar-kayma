import Axios from "axios";
import helpersMixin from "./helpers.mixin.js";
import {ConfigKeys, SessionStorageKeys, Endpoints, UserRoles} from "../constants";

export default {
  computed: {
    axiosConfig() {
      return {
        headers: {
          Authorization: `Bearer ${this.getSessionStorageItem(SessionStorageKeys.JWT)}`
        }
      };
    }
  },
  data() {
    return {
      apiUrl: this.getConfiguration(ConfigKeys.API_URL)
    };
  },
  mixins: [helpersMixin],
  methods: {
    /**
     * Send a login request
     * @param {string} username The username
     * @param {string} password The password
     */
    async login(username, password) {
      try {
        const result = await Axios.post(`${this.apiUrl}/auth/local`, {
          identifier: username,
          password: password
        });
        this.setSessionStorageItem(SessionStorageKeys.JWT, result.data.jwt);
        this.setSessionStorageItem(SessionStorageKeys.UID, result.data.user._id);
        this.setSessionStorageItem(SessionStorageKeys.U_FULLNAME, `${result.data.user.firstName || ''} ${result.data.user.lastName || ''}`);
        this.setSessionStorageItem(SessionStorageKeys.U_PROJECT, result.data.user.project);
        this.setSessionStorageItem(SessionStorageKeys.U_IS_SYSTEM_MANAGER, ['System Manager', 'Administrator'].includes(result.data.user.role.name).toString());
      } catch (reason) {
        throw reason;
      }
    },
    /**
     * Submit the DP to the server
     * @param {string} contact recipient's contact name
     * @param {string} recipientName The recipient's name
     * @param {string} recipientEmail The recipient's email
     * @param {Date} date DP date
     * @param {string} description DP description
     * @param {number} amount Payment sum
     * @param {string} comments DP notes
     * @param index
     * @param {{id: string, firstName: string, lastName: string}} user user object - may be null
     */
    submitDP(contact, recipientName, recipientEmail, date, description, amount, comments, index, user) {
      const uid = user == null ? this.getSessionStorageItem(SessionStorageKeys.UID) : user.id;
      const projectManager = user == null
        ? this.getSessionStorageItem(SessionStorageKeys.U_FULLNAME)
        : `${user.firstName == null ? '' : user.firstName} ${user.lastName == null ? '' : user.lastName}`;
      return Axios.post(
        `${this.apiUrl}/${Endpoints.ANTICIPATED_PAYMENT}`,
        {
          contact: contact,
          recipientName: recipientName,
          user: uid,
          recipientEmail: recipientEmail,
          date: date,
          description: description,
          amount: amount,
          comments: comments,
          projectManager: projectManager,
          index
        },
        this.axiosConfig
      );
    },
    /**
     * Get anticipated payments for current user
     */
    getAnticipatedPayments() {
      const params = this.getSessionStorageItem(SessionStorageKeys.U_IS_SYSTEM_MANAGER) === 'true' ?
        '_limit=9999' : `user=${this.getSessionStorageItem(SessionStorageKeys.UID)}&_limit=9999`;
      return Axios.get(`${this.apiUrl}/${Endpoints.ANTICIPATED_PAYMENT}?${params}`, this.axiosConfig);
    },
    /**
     * Get account numbers of anticipated payment model
     */
    async getAccountNumbers() {
      try {
        const result = await Axios.get(`${this.apiUrl}/content-type-builder/models/${Endpoints.ANTICIPATED_PAYMENT}`, this.axiosConfig);
        return result.data.model.attributes.find(attribute => attribute.name === "accountNumber").params.enum
      } catch (reason) {
        throw reason;
      }
    },
    /**
     * Gets all users
     */
    async getUsers() {
      try {
        const result = await Axios.get(`${this.apiUrl}/${Endpoints.USER}`, this.axiosConfig);
        return result.data;
      } catch (reason) {
        throw reason;
      }
    },
    /**
     * Gets users who are project managers
     * @returns {Promise<*>} project manager users
     */
    async getProjectManagers() {
      try {
        const authenticatedRoleParams = `role=${UserRoles.AUTHENTICATED}&blocked=false`;
        const result = await Axios.get(`${this.apiUrl}/${Endpoints.USER}?${authenticatedRoleParams}`, this.axiosConfig);
        return result.data;
      } catch (reason) {
        throw reason;
      }
    },
    /**
     * Removes a user of role 'authenticated'
     * @param {string} uid the ID to remove
     * @returns {Promise<*>}
     */
    async blockProjectManager(uid) {
      const result = await Axios.put(
        `${this.apiUrl}/${Endpoints.USER}/${uid}`,
        {
          blocked: true
        },
        this.axiosConfig
      );
      return result.data;
    },
    /**
     * Adds a new user of role 'authenticated'
     * @param {string} username desired username
     * @param {string} password user password
     * @param {string} email user email
     * @param {string} firstName user's first name
     * @param {string} lastName user's last name
     * @param {string} project project owned by the user
     * @param {string} projectCode code for the project
     * @returns {Promise<*>}
     */
    async submitNewProjectManager(username, password, email, firstName, lastName, project, projectCode) {
      try {
        const result = await Axios.post(
          `${this.apiUrl}/${Endpoints.USER}`,
          {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            project: project,
            projectCode: projectCode,
            role: UserRoles.AUTHENTICATED
          },
          this.axiosConfig
        );
        return result.data;
      } catch (reason) {
        throw reason;
      }
    },
    /**
     * saves edited payments in strapi
     * @param {any[]} payments array of edited payments to be saved
     */
    async updateAnticipatedPayments(payments) {
      let failedUpdates = [];
      for (const payment of payments) {
        try {
          await Axios.put(`${this.apiUrl}/${Endpoints.ANTICIPATED_PAYMENT}/${payment.id}`, payment, this.axiosConfig);
        } catch (reason) {
          console.error(reason);
          failedUpdates.push(payment);
        }
      }
      if (failedUpdates.length === 0) return true;
      this.updateAnticipatedPayments(failedUpdates);
    },
    /**
     * Updates project managers
     * @param users Users to update
     * @returns {Promise<boolean>}
     */
    async updateProjectManagers(users) {
      let failedUpdates = [];
      for (const uid in users) {
        if (!users.hasOwnProperty(uid)) {
          continue;
        }
        const user = users[uid];
        try {
          await Axios.put(`${this.apiUrl}/${Endpoints.USER}/${uid}`, user, this.axiosConfig);
        } catch (reason) {
          console.error(reason);
          failedUpdates.push(user);
        }
      }
      if (failedUpdates.length === 0) return true;
      this.updateProjectManagers(failedUpdates);
    },
    /**
     * Get the current counter
     */
    async getNextSequence() {
      const counter = await Axios.get(`${this.apiUrl}/${Endpoints.COUNTER}?_id=anticipatedpaymentid`, this.axiosConfig);
      await Axios.put(`${this.apiUrl}/${Endpoints.COUNTER}/anticipatedpaymentid`, {
        seq: counter.data[0].seq + 1
      }, this.axiosConfig);
      return counter.data[0].seq + 1
    }
  }
}