import Axios from "axios";
import * as config from '../config.json';

const apiUrl = config.apiUrl;
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
                    this.$root.$data.jwt = result.data.jwt;
                    this.$root.$data.uid = result.data.user._id;
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
                user: this.$root.$data.uid,
                recipientEmail: recipientEmail,
                date: date,
                description: description,
                amount: amount,
                comments: comments
            }, {
                    headers: {
                        Authorization: `Bearer ${this.$root.$data.jwt}`
                    }
                });
        },
        /**
         * Get anticipated payments for current user
         */
        getAnticipatedPayments() {
            return Axios.get(`${apiUrl}/anticipatedpayment?user=${this.$root.$data.uid}`, {
                headers: {
                    Authorization: `Bearer ${this.$root.$data.jwt}`
                }
            });
        }
    }
}