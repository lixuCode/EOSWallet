
Eos = require('eosjs')
let config = require("../config/config")

module.exports = {

    getEOSJS: (keyProvider) => {
        config.eosconfig.keyProvider = keyProvider
        return Eos(config.eosconfig)
    },

    success: (data) => {
        responseData = {
            code: 0,
            status: "success",
            data: data
        }
        return responseData
    },

    fail: (msg) => {
        responseData = {
            code: 1,
            status: "fail",
            data: msg
        }
        return responseData
    },

    doCallback: async (fn, args) => {
        return await fn.apply(this, args);
    },
}