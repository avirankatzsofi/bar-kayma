export const ConfigKeys = Object.freeze({
    API_URL: "apiUrl",
    ANTICIPATED_PAYMENT_CSV_FIELDS: "anticipatedPaymentCsvFields"
});
export const SessionStorageKeys = Object.freeze({
    JWT: "jwt",
    UID: "uid",
    U_FULLNAME: "uFullName",
    U_PROJECT: "uProject",
    U_IS_SYSTEM_MANAGER: "uIsSystemManager"
});
export const Endpoints = Object.freeze({
    USER: "user",
    ANTICIPATED_PAYMENT: "anticipatedpayment",
    COUNTER: "counters"
});
export const PaymentStatus = Object.freeze({
    PAYED: "Payed",
    UNPAYED: "Unpayed",
    CANCELLED: "Cancelled"
})