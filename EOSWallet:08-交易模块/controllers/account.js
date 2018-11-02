
let httpRequest = require("../utils/httpRequest")
let config = require("../config/config")
let {success, fail} = require("../utils/myUtils")
let myUtils = require("../utils/myUtils")

module.exports = {
    //通过钱包名称获取账号列表
    accountListForWallet: async (ctx) => {
        console.log(JSON.stringify(ctx.request.body))
        let { wallet, password } = ctx.request.body
        //获取钱包管理的所有公私钥对
        let res = await httpRequest.postRequest(config.walletGetKeys, [wallet, password])

        let accountList = []
        if (res.code == 0) {
            for (const index in res.data) {
                let keys = res.data[index]
                console.log(keys[0])
                //查询公钥关联的所有账号
                let resData = await httpRequest.postRequest(config.accountListForKey, { "public_key": keys[0] })
                if (resData.code == 0) {
                    resData.data.account_names.forEach(account => {
                        //去重
                        if (accountList.indexOf(account) < 0) {
                            accountList.push(account)
                        }
                    })
                }
            };
        }
        console.log("accountList:", accountList)

        res.data = accountList
        ctx.body = res
    },

    //创建账号
    accountCreate: async (ctx) => {
        console.log(JSON.stringify(ctx.request.body))
        let {account, creator, wallet, password, activepubkey, ownerpubkey} = ctx.request.body
        
        //１．获取钱包里面所有的私钥
        let privatekeyList = []
        let res = await httpRequest.postRequest(config.walletGetKeys, [wallet, password])
        if (res.code == 0 && res.data.length > 0) {
            for (const index in res.data) {
                let keys = res.data[index]
                privatekeyList.push(keys[1])
            }
            //2.设置创建账号默认的公钥
            let defaultKey = res.data[0][0]
    
            activepubkey = activepubkey || defaultKey
            ownerpubkey = ownerpubkey || defaultKey
        }

        console.log("privatekeyList:", privatekeyList)
        console.log("activepubkey:", activepubkey,"\n ownerpubkey:", ownerpubkey)

        //3.配置EOSJS
        eos = myUtils.getEOSJS(privatekeyList)

        //4.交易（创建账号）
        let data = await eos.transaction(tr => {
            tr.newaccount({
                creator: creator,
                name: account,
                owner: ownerpubkey,
                active: activepubkey
            })
    
            tr.buyrambytes({
                payer: creator,
                receiver: account,
                bytes: 8192
            })
    
            tr.delegatebw({
                from: creator,
                receiver: account,
                stake_net_quantity: '10.0000 EOS',
                stake_cpu_quantity: '10.0000 EOS',
                transfer: 0
            })
        })
        // console.log(JSON.stringify(data))

        //5.返回给前端执行的状态
        let resData
        if (data) {
            resData = success("创建账号成功")
        } else {
            resData = fail("创建账号失败")
        }
        ctx.body = resData
    },

    accountBalance: async (ctx) => {
        let {code, account} = ctx.request.body
        let params = {"code":code,"account":account}
        let res = await httpRequest.postRequest(config.accountBalance, params)

        let currencyList = []
        if (res.code == 0) {
            for (const index in res.data) {
                let currency = res.data[index] //"9996.0000 EOS"
                let currencys = currency.split(" ")//currencys[0]=9996.0000, currencys[1]=EOS
                currencyList.push({
                    "symbol":currencys[1], 
                    "amount":currencys[0]
                })
            }
        }
        res.data = currencyList
        console.log("currencyList:", currencyList)
        res.data = currencyList
        ctx.body = res
    },

    accountInfo: async (ctx) =>{
        let {account} = ctx.request.body
        let res = await httpRequest.postRequest(config.accountInfo, {"account_name":account})
        ctx.body = res
    },
}