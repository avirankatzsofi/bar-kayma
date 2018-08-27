import Axios from "axios";

const apiUrl = "http://localhost:1337";
export default {
    methods: {
        login(username, password) {
            return Axios.post(`${apiUrl}/auth/local`, {
                identifier: username,
                password: password
            })
                .catch(reason => console.log(reason))
                .then(result => this.$root.$data.jwt = result.data.jwt);
        },
        /**
         * Submit the DP to the server
         * @param {string} userToken the JWT of the current user
         * @param {string} recipientName The recipient's name
         * @param {string} reipientEmail The recipient's email
         * @param {Date} date DP date
         * @param {string} description DP description
         * @param {number} amount Payment sum
         * @param {string} comments DP notes
         */
        submitDP(userToken, recipientName, reipientEmail, date, description, amount, comments) {
            return Axios.post(`${apiUrl}/anticipatedpayment`, {
                recipientName: recipientName,
                reipientEmail: recipientName,
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