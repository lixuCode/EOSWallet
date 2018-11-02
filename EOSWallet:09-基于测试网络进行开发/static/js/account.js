
function accountInfo(acocunt) {
    localStorage.setItem("currentAccount", acocunt)
    window.location.href = "/accountinfo.html"
}

function goTransaction(account) {
    localStorage.setItem("currentAccount", account)
    window.location.href = "/transaction.html"
}

$(document).ready(function () {
    let currentwallet = localStorage.getItem("currentwallet")
    $("h1").text(currentwallet+" 钱包")
    if (!currentwallet) {
        return
    }
    let walletPassword = localStorage.getItem(currentwallet)
    $("input[name=wallet][hidden=hidden]").val(currentwallet)

    //获取账号列表
    let params = {"wallet":currentwallet, "password":walletPassword}
    $.post("/account/listforwallet", params, function (res, status) {
        console.log(status + JSON.stringify(res))
        if (res.code == 0) {
            let accountTable = $("#account-list-table")
            res.data.forEach(account => {
                let accountTr = `
                    <tr>
                    <td>${account}</td>
                    <td><button onclick="accountInfo('${account}')">查看详情</button></td>
                    <td><button onclick="goTransaction('${account}')">去转账</button></td>
                </tr>`
                accountTable.append(accountTr)
            });

            sessionStorage.setItem(`wallet-${currentwallet}-accounts`, JSON.stringify(res.data))
        }
    })

    //导入账户
    $("#account-import-form").validate({
        rules: {
            privatekey: {
                required: true,
            },
        },
        messages: {
            privatekey: {
                required: "请输入要导入的账号的私钥",
            },
        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                url: "/wallet/importkey",
                type: "post",
                dataType: "json",
                success: function (res, status) {
                    console.log(status + JSON.stringify(res))
                    alert(JSON.stringify(res.data))
                    if (res.code == 0) {
                        window.location.reload()
                    }
                },
                error: function (res, status) {
                    console.log(status + JSON.stringify(res))
                }
            });
        }
    })
})