c


let { success, fail } = require("../utils/myUtils")
let myUtils = require("../utils/myUtils")
let walletModel = require("../models/wallet")

async function getRamInfo() {
    ramData = await eos.getTableRows(true, "eosio", "eosio", "rammarket")

    //RAM消耗的EOS数量
    let eosAmount = ramData.rows[0].quote.balance.split(" ")[0];
    //RAM使用量
    let ramAmount = ramData.rows[0].base.balance.split(" ")[0] / 1024;
    //RAM价格
    let ramPriceWithEOS = eosAmount / ramAmount
    console.log(eosAmount, ramAmount, ramPriceWithEOS);
    return {
        ramUsed: ramAmount / (1024 * 1024),
        ramPrice: ramPriceWithEOS,
    }
}

module.exports = {
    netResourceGetRAMInfo: async (ctx) => {
        console.log(ctx.request.body)
        let { wallet, password } = ctx.request.body
        //获取钱包里面所有的私钥配置EOSJS
        let privatekeyList = await walletModel.getWalletPrivatekeyList(wallet, password)
        eos = myUtils.getEOSJS(privatekeyList)

        let ramData = await eos.getTableRows(true, "eosio", "eosio", "global")
        //ram总量，bytes转为G
        let ramTotal = ramData.rows[0].max_ram_size / (1024 * 1024 * 1024)
        console.log(ramTotal);

        let ramInfo = await getRamInfo()
        ctx.body = success({
            ramPrice: ramInfo.ramPrice,
            ramTotal: ramTotal,
            ramAvailable: ramTotal - ramInfo.ramUsed,
        })
    },

    netResourceTransactionRAM: async (ctx) => {
        console.log(ctx.request.body)
        let { amount, transaction_type, account, wallet, password } = ctx.request.body
        //获取钱包里面所有的私钥配置EOSJS
        let privatekeyList = await walletModel.getWalletPrivatekeyList(wallet, password)
        eos = myUtils.getEOSJS(privatekeyList)

        let result
        if (transaction_type == '1') {
            //买RAM
            console.log("买RAM")
            let ramInfo = await getRamInfo()
            let ramAmount = parseInt((amount / ramInfo.ramPrice) * 1024)
            console.log("ramAmount:", ramAmount)
            result = await eos.transaction(tr => {
                tr.buyrambytes({
                    payer: account,
                    receiver: account,
                    bytes: ramAmount
                })
            })
        } else {
            //卖RAM
            console.log("卖RAM")
            let ramAmount = parseInt(amount * 1024)
            result = await eos.transaction(tr => {
                tr.sellram({
                    account: account,
                    bytes: ramAmount
                })
            })
        }

        console.log("data:", result)
        if (result.broadcast) {
            ctx.body = success("ok")
        } else {
            ctx.body = fail("error")
        }
    }

}