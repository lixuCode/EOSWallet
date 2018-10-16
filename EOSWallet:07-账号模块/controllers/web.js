
module.exports = {
    getWalletHtml: async(ctx) => {
        await ctx.render("wallet.html")
    },
    
    getAccountHtml:async(ctx) => {
        await ctx.render("account.html")
    },

    getAccountInfoHtml:async(ctx) =>　{
        await ctx.render("accountInfo.html")
    },

    getAccountCreateHtml:async(ctx) =>　{
        await ctx.render("accountNew.html")
    },
}