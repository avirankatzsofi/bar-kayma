import Axios from "axios";
import helpersMixin from "./helpers.mixin.js";
import { ConfigKeys, SessionStorageKeys, Endpoints } from "../constants.js";

export default {
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
                sessionStorage.setItem(SessionStorageKeys.JWT, result.data.jwt);
                sessionStorage.setItem(SessionStorageKeys.UID, result.data.user._id);
                sessionStorage.setItem(SessionStorageKeys.U_FULLNAME, `${result.data.user.firstName || ''} ${result.data.user.lastName || ''}`);
                sessionStorage.setItem(SessionStorageKeys.U_PROJECT, result.data.user.project);
                sessionStorage.setItem(SessionStorageKeys.U_IS_SYSTEM_MANAGER, ['System Manager', 'Administrator'].includes(result.data.user.role.name));
            } catch (reason) {
                throw reason;
            }
        },
        /**
         * Submit the DP to the server
         * @param {string} recipientName The recipient's name
         * @param {string} recipientEmail The recipient's email
         * @param {Date} date DP date
         * @param {string} description DP description
         * @param {number} amount Payment sum
         * @param {string} comments DP notes
         */
        submitDP(contact, recipientName, recipientEmail, date, description, amount, comments, index) {
            return Axios.post(`${this.apiUrl}/${Endpoints.ANTICIPATED_PAYMENT}`, {
                contact: contact,
                recipientName: recipientName,
                user: sessionStorage.getItem(SessionStorageKeys.UID),
                recipientEmail: recipientEmail,
                date: date,
                description: description,
                amount: amount,
                comments: comments,
                projectManager: sessionStorage.getItem(SessionStorageKeys.U_FULLNAME),
                index
            }, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(SessionStorageKeys.JWT)}`
                    }
                });
        },
        /**
         * Get anticipated payments for current user
         */
        getAnticipatedPayments() {
            const params = sessionStorage.getItem(SessionStorageKeys.U_IS_SYSTEM_MANAGER) == 'true' ?
                '_limit=9999' : `user=${sessionStorage.getItem(SessionStorageKeys.UID)}&_limit=9999`
            return Axios.get(`${this.apiUrl}/${Endpoints.ANTICIPATED_PAYMENT}?${params}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(SessionStorageKeys.JWT)}`
                }
            });
        },
        /**
         * Get account numbers of anticipated payment model
         */
        async getAccountNumbers() {
            try {
                const result = await Axios.get(`${this.apiUrl}/content-type-builder/models/${Endpoints.ANTICIPATED_PAYMENT}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(SessionStorageKeys.JWT)}`
                    }
                });
                return result.data.model.attributes.find(attribute => attribute.name === "accountNumber").params.enum
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
                    await Axios.put(`${this.apiUrl}/${Endpoints.ANTICIPATED_PAYMENT}/${payment.id}`, payment, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem(SessionStorageKeys.JWT)}`
                        }
                    });
                } catch (reason) {
                    console.error(reason);
                    failedUpdates.push(payment);
                }
            }
            if (failedUpdates.length == 0) return true;
            this.updateAnticipatedPayments(failedUpdates);
        },
        /**
         * Get the current counter
         */
        async getNextSequence() {
            const counter = await Axios.get(`${this.apiUrl}/${Endpoints.COUNTER}?_id=anticipatedpaymentid`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(SessionStorageKeys.JWT)}`
                }
            })
            await Axios.put(`${this.apiUrl}/${Endpoints.COUNTER}/anticipatedpaymentid`, {
                seq: counter.data[0].seq + 1
            }, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(SessionStorageKeys.JWT)}`
                    }
                })
            return counter.data[0].seq + 1
        }
    }
}