

let {success, fail} = require("../utils/myUtils")
let myUtils = require("../utils/myUtils")
let walletModel = require("../models/wallet")

module.exports = {
    transactionSend: async (ctx) => {
        console.log(ctx.request.body)
        let { from, to, amount, symbol, memo, wallet, password } = ctx.request.body

        //1.获取钱包里面所有的私钥
        let privatekeyList = await walletModel.getWalletPrivatekeyList(wallet, password)

        //2.配置EOSJS
        eos = myUtils.getEOSJS(privatekeyList)

        //3.发起转账交易
        options = {
            authorization: `${from}@active`,
            broadcast: true,
            sign: true
        }
        let data = await eos.transaction(eos => {
            let stantardAmount = parseFloat(amount).toFixed(4)
            eos.transfer(from, to, `${stantardAmount} ${symbol}`, memo, options)
        })
        console.log("data:", data)

        //4.返回给前端执行的状态
        let resData
        if (data) {
            resData = success("转账成功")
        } else {
            resData = fail("转账失败")
        }
        ctx.body = resData
    },
}