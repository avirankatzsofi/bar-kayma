import Axios from "axios";
import * as config from '../config.json';

const apiUrl = config.apiUrl;
const sessionStorageKeys = {
    jwt: 'jwt',
    uid: 'uid',
    uFullName: 'uFullName'
};

export default {
    methods: {
        /**
         * Send a login request
         * @param {string} username The username
         * @param {string} password The password
         */
        login(username, password) {
            return Axios.post(`${apiUrl}/auth/local`, {
                identifier: username,
                password: password
            })
                .catch(reason => console.log(reason))
                .then(result => {
                    sessionStorage.setItem(sessionStorageKeys.jwt, result.data.jwt);
                    sessionStorage.setItem(sessionStorageKeys.uid, result.data.user._id);
                    sessionStorage.setItem(sessionStorageKeys.uFullName, `${result.data.user.firstName} ${result.data.user.lastName}`);
                });
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
        submitDP(recipientName, recipientEmail, date, description, amount, comments) {
            return Axios.post(`${apiUrl}/anticipatedpayment`, {
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