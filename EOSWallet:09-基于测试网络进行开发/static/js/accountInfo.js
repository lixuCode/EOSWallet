
function getAccountPermissionPrivateKey(publicKey) {
    let currentwallet = localStorage.getItem("currentwallet")
    let currentPassword = localStorage.getItem(currentwallet)
    let params = {"wallet":currentwallet, "password":currentPassword, "publickey":publicKey}
    console.log(params)
    $.post("/wallet/privatekey", params, function (res, status) {
        console.log(status, JSON.stringify(res))
        alert(JSON.stringify(res.data))
    })
}

$(document).ready(function () {
    let currentAccount = localStorage.getItem("currentAccount")
    $("h1").text(currentAccount+" 账号")
    if (!currentAccount) {
        return
    }

    //账号金额
    let params = {"code":"eosio.token","account":currentAccount}
    $.post("/account/balance", params, function (res, status) {
        console.log(status + JSON.stringify(res))
        //后端返回的数据结构如下
        //[{"symbol":"EOS", "amout":100}, {"symbol":"SYS", "amount":200}]
        if (res.code == 0) {
            let balanceTable = $("#account-balance-table")
            res.data.forEach(balanceData => {
                let balanceTr = `<tr>
                    <td>${balanceData.symbol}</td>
                    <td>${balanceData.amount}</td>
                </tr>`
                balanceTable.append(balanceTr)
            });
        }
    })

    //账号权限详情
    $.post("/account/info", {"account":currentAccount}, function (res, status) {
        console.log(status + JSON.stringify(res))
        if (res.code == 0) {
            let permissionTable = $("#account-permission-table")
            for (const index in res.data.permissions) {
                let permission = res.data.permissions[index]
                let publicKey = permission.required_auth.keys[0].key
                let rowTr = `<tr>
                    <td>${permission.perm_name}</td>
                    <td>${permission.required_auth.threshold}</td>
                    <td>${publicKey}</td>
                    <td><button onclick="getAccountPermissionPrivateKey('${publicKey}')">点击查看</button></td>
                    <td>${permission.required_auth.keys[0].weight}</td>
                </tr>`
                permissionTable.append(rowTr)

                for(let i = 1; i < permission.required_auth.keys.length; i++) {
                    let keyData = permission.required_auth.keys[i]
                    let rowTr = `<tr>
                        <td></td>
                        <td></td>
                        <td>${keyData.key}</td>
                        <td><button onclick="getAccountPermissionPrivateKey('${keyData.key}')">点击查看</button></td>
                        <td>${keyData.weight}</td>
                    </tr>`
                    permissionTable.append(rowTr)
                };
            };
        }
    })
})