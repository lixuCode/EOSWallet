

let httpRequest = require("../utils/httpRequest")
let config = require("../config/config")

module.exports = {
    getWalletPrivatekeyList: async (wallet, password) => {
        let privatekeyList = []
        let res = await httpRequest.postRequest(config.walletGetKeys, [wallet, password])
        if (res.code == 0 && res.data.length > 0) {
            for (const index in res.data) {
                let keys = res.data[index]
                privatekeyList.push(keys[1])
            }
        }
        return privatekeyList
    }
}