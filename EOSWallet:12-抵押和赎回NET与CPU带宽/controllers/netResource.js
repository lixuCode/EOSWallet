

let { success, fail } = require("../utils/myUtils")
let myUtils = require("../utils/myUtils")
let walletModel = require("../models/wallet")
let httpRequest = require("../utils/httpRequest")
let config = require("../config/config")

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
    },

    netResourceGetBandwidthPrice: async (ctx) => {
        console.log(ctx.request.body)
        let { account } = ctx.request.body

        let res = await httpRequest.postRequest(config.accountInfo, { "account_name": account })
        if (res.code == 0) {
            data = res.data
            //1. 计算NET价格
            //抵押NET的EOS数量
            var netBalance = data.net_weight / 10000
            //NET贷款的总量
            var netTotal = data.net_limit.max / 1024
            //(netBalance / netTotal)获取到的是过去3天内的平均消耗量，除以３获取每天的平均消耗量，即价格
            netPrice = ((netBalance / netTotal) / 3).toFixed(4)
            console.log(netBalance, netTotal, netPrice)

            //1. 计算CPU价格
            //抵押CPU的EOS数量
            var cpuBalance = data.cpu_weight / 10000
            //CPU贷款的总量
            var cpuTotal = data.cpu_limit.max / 1024
            //(cpuBalance / cpuTotal)获取到的是过去3天内的平均消耗量，除以３获取每天的平均消耗量，即价格
            cpuPrice = ((cpuBalance / cpuTotal) / 3).toFixed(4)

            ctx.body = success({
                netPrice: netPrice,
                cpuPrice: cpuPrice,
            })
        } else {
            ctx.body = res
        }
    },

    netResourceTransactionBandwidth: async (ctx) => {
        console.log(ctx.request.body)
        let { net_amount, cpu_amount, bandwidth_transaction_type, account, wallet, password } = ctx.request.body

        //获取钱包里面所有的私钥配置EOSJS
        let privatekeyList = await walletModel.getWalletPrivatekeyList(wallet, password)
        eos = myUtils.getEOSJS(privatekeyList)

        let result
        if (bandwidth_transaction_type == '1') {
            //抵押EOS购买NET、CPU
            result = await eos.transaction(tr => {
                tr.delegatebw({
                    from: account,
                    receiver: account,
                    stake_net_quantity: parseFloat(net_amount).toFixed(4) + " EOS",
                    stake_cpu_quantity: parseFloat(cpu_amount).toFixed(4) + " EOS",
                    transfer: 0
                })
            })
        } else {
            //从NET、CPU资源中赎回EOS
            result = await eos.transaction(tr => {
                tr.undelegatebw({
                    from: account,
                    receiver: account,
                    unstake_net_quantity: parseFloat(net_amount).toFixed(4) + " EOS",
                    unstake_cpu_quantity: parseFloat(cpu_amount).toFixed(4) + " EOS",
                })
            })
        }

        console.log("data:", result)
        if (result.broadcast) {
            ctx.body = success("ok")
        } else {
            ctx.body = fail("error")
        }
    },
}

