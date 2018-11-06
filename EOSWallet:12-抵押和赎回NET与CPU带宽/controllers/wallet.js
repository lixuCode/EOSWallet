
let httpRequest = require("../utils/httpRequest")
let config = require("../config/config")

module.exports = {
    walletCreate: async(ctx) =>{
        console.log(JSON.stringify(ctx.request.body))
        let {wallet} = ctx.request.body

        let res = await httpRequest.postRequest(config.walletCreate, wallet)
        if (res.code == 0) {
            res.data = {"password":res.data, "wallet":wallet}
        }
        ctx.body = res
    },

    walletOpen: async(ctx) =>{
        console.log(JSON.stringify(ctx.request.body))
        let {wallet} = ctx.request.body

        let res = await httpRequest.postRequest(config.walletOpen, wallet)
        ctx.body = res
    },

    walletList: async(ctx) => {
        let res = await httpRequest.postRequest(config.walletList, null)
        ctx.body = res
    },

    walletUnlock:async(ctx) => {
        console.log(JSON.stringify(ctx.request.body))
        let {wallet, password} = ctx.request.body

        let res = await httpRequest.postRequest(config.walletUnlock, [wallet, password])
        ctx.body = res
    },

    walletLock: async(ctx) => {
        console.log(JSON.stringify(ctx.request.body))
        let {wallet} = ctx.request.body

        let res = await httpRequest.postRequest(config.walletLock, wallet)
        ctx.body = res
    },

    walletImportPrivatekey:async(ctx) => {
        console.log(JSON.stringify(ctx.request.body))
        let {wallet, privatekey} = ctx.request.body

        let res = await httpRequest.postRequest(config.walletImportPrivatekey, [wallet, privatekey])
        ctx.body = res
    },

    walletGetKeys:async(ctx) => {
        console.log(JSON.stringify(ctx.request.body))
        let {wallet, password} = ctx.request.body

        let res = await httpRequest.postRequest(config.walletGetKeys, [wallet, password])
        ctx.body = res
    },

    walletCreateKey: async(ctx) =>{
        let {wallet, type} = ctx.request.body
        let res = await httpRequest.postRequest(config.walletCreateKey, [wallet, type])
        ctx.body = res
    },

    walletPubkeyGetPrivatekey: async(ctx) => {
        let {wallet, password, publickey} = ctx.request.body
        let res = await httpRequest.postRequest(config.walletGetKeys, [wallet, password])

        let privatekey = "无权查看"
        for (const index in res.data) {
            let keys = res.data[index]
            if (keys[0] == publickey) {
                privatekey = keys[1]
                break
            }
        }

        res.data = privatekey
        ctx.body = res
    }
}