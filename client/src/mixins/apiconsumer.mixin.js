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
        }
    },
    // data() {
    //     return {
    //         jwt: ""
    //     };
    // }
}