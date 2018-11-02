
function createKey() {
    let currentwallet = localStorage.getItem("currentwallet")
    let params = {"wallet": currentwallet, "type":"k1"}
    $.post("/wallet/createkey", params, function (res, status) {
        console.log(status, JSON.stringify(res))
        alert(res.data)
    })
}

$(document).ready(function () {
    let currentwallet = localStorage.getItem("currentwallet")
    $("h1").text(currentwallet+" 钱包")
    if (!currentwallet) {
        return
    }

    let walletPassword = localStorage.getItem(currentwallet)

    $("input[name=wallet][hidden=hidden]").val(currentwallet)
    $("input[name=password][hidden=hidden]").val(walletPassword)

    //选择新建者账号列表
    let accountList = sessionStorage.getItem(`wallet-${currentwallet}-accounts`)
    accountList = JSON.parse(accountList)
    console.log("accountList",accountList)
    let accountSelectList = $("#account-create-creator-select")
    for(let i = 0; accountList && i < accountList.length; i++) {
        let account = accountList[i]
        let accountOption = `<option value="${account}">${account}</option>`
        accountSelectList.append(accountOption)
    }

    //新建账号
    $("#account-create-form").validate({
        rules: {
            name: {required: true,},
            creator: {required: true,},
        },
        messages: {
            name: {required: "请输入要新建的账号名称",},
            creator: {required: "该钱包没有可供新建账号的创者账号，可将该钱包的任意一个公钥发送给其它钱包新建该账号，或者导入其他账号的私钥到该钱包再进行新建账号"},
        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                url: "/account/create",
                type: "post",
                dataType: "json",
                success: function (res, status) {
                    console.log(status + JSON.stringify(res))
                    if (res.code == 0) {
                        alert("账号新建成功")
                        window.location.href = history.go(-1);
                    }　else {
                        alert("账号新建失败")
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