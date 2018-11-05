
module.exports = {
    getWalletHtml: async(ctx) => {
        await ctx.render("wallet.html")
    },
}