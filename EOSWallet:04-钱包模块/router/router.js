let router = require("koa-router")()

let webController = require("../controllers/web")
let walletController = require("../controllers/wallet")

//钱包
router.post("/wallet/create", walletController.walletCreate)
router.post("/wallet/open", walletController.walletOpen)
router.get("/wallet/list", walletController.walletList)
router.post("/wallet/unlock", walletController.walletUnlock)
router.post("/wallet/lock", walletController.walletLock)
router.post("/wallet/importkey", walletController.walletImportPrivatekey)
router.post("/wallet/keys", walletController.walletGetKeys)
router.post("/wallet/createkey", walletController.walletCreateKey)
router.post("/wallet/privatekey", walletController.walletPubkeyGetPrivatekey)

//页面
router.get("/wallet.html", webController.getWalletHtml)

module.exports = router