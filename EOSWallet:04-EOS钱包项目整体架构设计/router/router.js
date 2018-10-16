let router = require("koa-router")()

router.get("/", async (ctx) => {
    await ctx.render("wallet.html")
})

module.exports = router