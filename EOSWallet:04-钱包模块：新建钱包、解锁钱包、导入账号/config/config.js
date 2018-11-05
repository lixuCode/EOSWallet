

let binaryen = require('binaryen')

module.exports = {
    eosconfig:{
        httpEndpoint:"http://127.0.0.1:8888",
        chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f", // 32 byte (64 char) hex string
        
        // keyProvider: privatekeyList, // WIF string or array of keys..
        binaryen: binaryen,
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        sign: true
    },
    walletAddress:"http://127.0.0.1:8889",

    walletCreate:"/v1/wallet/create",
    walletOpen:"/v1/wallet/open",
    walletList:"/v1/wallet/list_wallets",
    walletUnlock:"/v1/wallet/unlock",
    walletLock: "/v1/wallet/lock",
    walletImportPrivatekey:"/v1/wallet/import_key",
    walletGetKeys:"/v1/wallet/list_keys",
    walletCreateKey:"/v1/wallet/create_key",

    accountListForKey:"/v1/history/get_key_accounts",
    accountBalance: "/v1/chain/get_currency_balance",
    accountInfo:"/v1/chain/get_account",
}