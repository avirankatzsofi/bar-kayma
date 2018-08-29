import Axios from "axios";
import * as config from '../config.json';

const apiUrl = config.apiUrl;
export default {
    methods: {
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
         * @param {string} userToken the JWT of the current user
         * @param {string} uid Current user's UID
         * @param {string} recipientName The recipient's name
         * @param {string} recipientEmail The recipient's email
         * @param {Date} date DP date
         * @param {string} description DP description
         * @param {number} amount Payment sum
         * @param {string} comments DP notes
         */
        submitDP(userToken, uid, recipientName, recipientEmail, date, description, amount, comments) {
            return Axios.post(`${apiUrl}/anticipatedpayment`, {
                recipientName: recipientName,
                user: uid,
                recipientEmail: recipientEmail,
                date: date,
                description: description,
                amount: amount,
                comments: comments
            }, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
        }
    },
    // data() {
    //     return {
    //         jwt: ""
    //     };
    // }
}