//导入私钥
function importPrivatekey(wallet) {
    var privatekey = prompt("请输入您需要导入的私钥");
    if(privatekey) {
        let params = {"wallet":wallet, "privatekey":privatekey}
        console.log(params)
        $.post("/wallet/importkey", params, function (res, status) {
            console.log(status, JSON.stringify(res))
            if (res.code == 0) {
                
            }
        })
    }
}

//获取钱包的公私钥列表
function getPublickeyList(name) {
    var password = prompt(`请输入"${name}"钱包的密码`);
    if(password) {
        let params = {"wallet":name, "password":password}
        console.log(params)
        $.post("/wallet/keys", params, function (res, status) {
            console.log(status, JSON.stringify(res))
            alert(JSON.stringify(res.data))
        })
    }
}

//解锁钱包
function unlockWallet(name) {
    var password = prompt(`请输入"${name}"钱包的密码`);
    if(password) {
        let params = {"wallet":name, "password":password}
        console.log(params)
        $.post("/wallet/unlock", params, function (res, status) {
            console.log(status, JSON.stringify(res))
            alert(JSON.stringify(res.data))
            if (res.code == 0) {
                unlockWalletComplete(name)
                localStorage.setItem(name, password)
            }
        })
    }
}

//锁定钱包
function lockWallet(name) {
    let params = {"wallet":name}
    $.post("/wallet/lock", params, function (res, status) {
        console.log(status, JSON.stringify(res))
        alert(JSON.stringify(res.data))
        if (res.code == 0) {
            lockWalletComplete(name)
        }
    })
}

function getAccountList(name) {
    localStorage.setItem("currentwallet", name)
    window.location.href = "/account.html"
}

function unlockWalletComplete(name) {
    console.log(name,name.length)
    $(`#unlock${name}`).text("已解锁")
    $(`#lock${name}`).text("未锁定")
    $(`#unlock${name}`).attr({"disabled":"disabled"})
    $(`#lock${name}`).attr({"disabled":false})
    $(`#importkey${name}`).attr({"disabled":false})
    $(`#getkeys${name}`).attr({"disabled":false})
    $(`#getaccounts${name}`).attr({"disabled":false})
}

function lockWalletComplete(name) {
    $(`#unlock${name}`).text("未解锁")
    $(`#lock${name}`).text("已锁定")
    $(`#unlock${name}`).attr({"disabled":false})
    $(`#lock${name}`).attr({"disabled":"disabled"})
    $(`#importkey${name}`).attr({"disabled":"disabled"})
    $(`#getkeys${name}`).attr({"disabled":"disabled"})
    $(`#getaccounts${name}`).attr({"disabled":"disabled"})
}

$(document).ready(function () {

    //获取钱包列表
    $.get("/wallet/list", function (res, status) {
        console.log(status, JSON.stringify(res))

        if (res.code == 0) {
            let walletTable = $("#wallet-list-table")
            res.data.forEach(wallet => {

                let walletName = wallet
                let isUnlock = false
                if(wallet.charAt(wallet.length-1)=="*"){
                    isUnlock = true
                    walletName = wallet.slice(0,-2)
                }
                let walletTr = `<tr>
                    <td>${walletName}</td>
                    <td><button id="unlock${walletName}" onclick="unlockWallet('${walletName}')">未解锁</button></td>
                    <td><button id="lock${walletName}" disabled="disabled" onclick="lockWallet('${walletName}')">已锁定</button></td>
                    <td><button id="importkey${walletName}" disabled="disabled" onclick="importPrivatekey('${walletName}')">导入私钥</button></td>
                    <td><button id="getkeys${walletName}" disabled="disabled" onclick="getPublickeyList('${walletName}')">获取公私钥对</button></td>
                    <td><button id="getaccounts${walletName}" disabled="disabled" onclick="getAccountList('${walletName}')">账号列表</button></td>
                </tr>`
                walletTable.append(walletTr)

                if(isUnlock){
                    unlockWalletComplete(walletName)
                }
            });
        }
    })

    //创建钱包
    $("#wallet-create-form").validate({
        rules: {
            wallet: {
                required: true,
            },
        },
        messages: {
            wallet: {
                required: "请输入新建的钱包名称",
            },
        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                url: "/wallet/create",
                type: "post",
                dataType: "json",
                success: function (res, status) {
                    console.log(status + JSON.stringify(res))
                    alert(JSON.stringify(res.data))
                    if (res.code == 0) {
                        window.location.reload()
                        localStorage.setItem(res.data.wallet, res.data.password)
                    }
                },
                error: function (res, status) {
                    console.log(status + JSON.stringify(res))
                }
            });
        }
    })

    //打开钱包
    $("#wallet-open-form").validate({
        rules: {
            wallet: {
                required: true,
            },
        },
        messages: {
            wallet: {
                required: "请输入要打开的钱包名称",
            },
        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                url: "/wallet/open",
                type: "post",
                dataType: "json",
                success: function (res, status) {
                    console.log(status + JSON.stringify(res))
                    if (res.code == 0) {
                        window.location.reload()
                    } else {
                        alert(JSON.stringify(res.data))
                    }
                },
                error: function (res, status) {
                    console.log(status + JSON.stringify(res))
                }
            });
        }
    })
})