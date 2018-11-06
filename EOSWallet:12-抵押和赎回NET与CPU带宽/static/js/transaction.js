

//账号金额
function updateAccountBalance(account) {
    let params = {"code":"eosio.token","account":account}
    $.post("/account/balance", params, function (res, status) {
        console.log(status + JSON.stringify(res))
        if (res.code == 0) {
            let balanceTable = $("#transation-balance-table")
            balanceTable.empty()
            if (res.data && res.data.length > 0) {
                res.data.forEach(balanceData => {
                    let balanceTr = `<tr>
                        <td>${balanceData.symbol}</td>
                        <td>${balanceData.amount}</td>
                    </tr>`
                    balanceTable.append(balanceTr)
                });
                tokenSelectList(res.data)
            } else {
                let balanceTr = `<tr>
                        <td>无存款</td>
                    </tr>`
                balanceTable.append(balanceTr)
                tokenSelectList([])
            } 
        }
    })
}

//选择Token列表
function tokenSelectList(tokenList) {
    let TokenSelectList = $("#transaction-send-token-select")
    TokenSelectList.empty()

    for(let i = 0; i < tokenList.length; i++) {
        let token = tokenList[i]
        let option = `<option value="${token.symbol}">${token.symbol}</option>`
        TokenSelectList.append(option)
    }
}
    
$(document).ready(function () {
    let currentwallet = localStorage.getItem("currentwallet")
    $("h1").text(currentwallet+" 钱包")
    if (!currentwallet) {
        return
    }
    let currentAccount = localStorage.getItem("currentAccount")
    let walletPassword = localStorage.getItem(currentwallet)

    $("input[name=wallet][hidden=hidden]").val(currentwallet)
    $("input[name=password][hidden=hidden]").val(walletPassword)

    //选择账号列表
    let accountList = sessionStorage.getItem(`wallet-${currentwallet}-accounts`)
    accountList = JSON.parse(accountList)
    console.log("accountList",accountList)
    let accountSelectList = $("#transaction-send-account-select")
    for(let i = 0; accountList && i < accountList.length; i++) {
        let account = accountList[i]
        let accountOption
        if (account == currentAccount) {
            accountOption = `<option selected="selected" value="${account}">${account}</option>`
        } else {
            accountOption = `<option value="${account}">${account}</option>`
        }
        accountSelectList.append(accountOption)
    }
    
    //账号金额
    updateAccountBalance(currentAccount)

    //选择不同的账号
    accountSelectList.change(function() {
        console.log(this.value)
        localStorage.setItem("currentAccount", this.value)
        updateAccountBalance(this.value)
    })

    //发送交易
    $("#transaction-send-form").validate({
        rules: {
            from: {required: true,},
            to: {required: true,},
            amount: {required: true,},
        },
        messages: {
            frmo: {required: "请选择转出的账号",},
            to: {required: "请输入对方账号名称",},
            amount: {required: "请输入转账的数量",},
        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                url: "/transaction/send",
                type: "post",
                dataType: "json",
                success: function (res, status) {
                    console.log(status + JSON.stringify(res))
                    alert(JSON.stringify(res.data))
                    if (res.code == 0) {
                    }
                },
                error: function (res, status) {
                    console.log(status + JSON.stringify(res))
                    alert(res.data)
                }
            });
        }
    })
})