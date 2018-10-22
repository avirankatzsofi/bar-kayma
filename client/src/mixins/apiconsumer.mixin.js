import Axios from "axios";
import * as config from '../config.json';

const apiUrl = config.apiUrl;
const sessionStorageKeys = config.sessionStorageKeys;

export default {
    methods: {
        /**
         * Send a login request
         * @param {string} username The username
         * @param {string} password The password
         */
        async login(username, password) {
            try {
                const result = await Axios.post(`${apiUrl}/auth/local`, {
                    identifier: username,
                    password: password
                });
                sessionStorage.setItem(sessionStorageKeys.jwt, result.data.jwt);
                sessionStorage.setItem(sessionStorageKeys.uid, result.data.user._id);
                sessionStorage.setItem(sessionStorageKeys.uFullName, `${result.data.user.firstName} ${result.data.user.lastName}`);
                sessionStorage.setItem(sessionStorageKeys.uProject, result.data.user.project);
                sessionStorage.setItem(sessionStorageKeys.uIsSystemManager, result.data.user.role.name === 'System Manager');
            }
            catch (reason) {
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
        submitDP(contact, recipientName, recipientEmail, date, description, amount, comments) {
            return Axios.post(`${apiUrl}/anticipatedpayment`, {
                contact: contact,
                recipientName: recipientName,
                user: sessionStorage.getItem(sessionStorageKeys.uid),
                recipientEmail: recipientEmail,
                date: date,
                description: description,
                amount: amount,
                comments: comments,
                projectManager: sessionStorage.getItem(sessionStorageKeys.uFullName)
            }, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(sessionStorageKeys.jwt)}`
                    }
                });
        },
        /**
         * Get anticipated payments for current user
         */
        getAnticipatedPayments() {
            return Axios.get(`${apiUrl}/anticipatedpayment?user=${sessionStorage.getItem(sessionStorageKeys.uid)}&_limit=9999`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(sessionStorageKeys.jwt)}`
                }
            });
        }
    }
}