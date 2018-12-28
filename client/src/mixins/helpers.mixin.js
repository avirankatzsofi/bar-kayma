import config from "../config.json";
import defaultConfig from "../default.config.json"
import { SessionStorageKeys } from "../constants.js";
/**
 * @mixin
 */
export default {
    computed: {
        uIsSystemManager() {
            return this.getSessionStorageItem(SessionStorageKeys.U_IS_SYSTEM_MANAGER) == true.toString();
        }
    },
    methods: {
        /**
         * Get a session storage item by key
         * @param {string} key item's key
         * @returns {string} the item's value
         */
        getSessionStorageItem(key) {
            return sessionStorage.getItem(key);
        },
        /**
         * Set a session storage item
         * @param {string} key item key
         * @param {string} value item value
         */
        setSessionStorageItem(key, value) {
            sessionStorage.setItem(key, value);
        },
        /**
         * Download a file
         * @param {string} filename the designated filename (e.g. incomes.csv)
         * @param {string} text the content of the file
         */
        downloadFile(filename, text) {
            var element = document.createElement("a");
            element.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + encodeURIComponent(text)
            );
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        /**
        * Convert an object to CSV file
        * @param {Object} object
        * @param {{field: string, displayName: string}[]} headers
        * @returns {string} the CSV contents as a string
        */
        convertToCsv(object, headers) {
            const replacer = (key, value) => (value == null ? "" : value); // specify how you want to handle null values here
            let csv = object.map(row =>
                headers
                    .map(header => {
                        let value = false;
                        for (const field of header.field.split(".")) {
                            value = value ? value[field] : row[field];
                        }
                        return JSON.stringify(value, replacer);
                    })
                    .join(",")
            );
            csv.unshift(headers.map(header => header.displayName).join(","));
            csv = csv.join("\n");
            return csv;
        },
        /**
         * Gets a configuration
         * @param {string} key key to look for
         * @returns {any} the value
         */
        getConfiguration(key) {
            return config[key] || defaultConfig[key];
        }
    }
}