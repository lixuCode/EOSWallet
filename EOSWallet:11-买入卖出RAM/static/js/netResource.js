

$(document).ready(function () {
    let currentAccount = localStorage.getItem("currentAccount")
    $("#current-account").text(currentAccount)

    //我的网络资源详情ramAvailable
    $.post("/account/info", { "account": currentAccount }, function (res, status) {
        console.log(status + JSON.stringify(res))
        if (res.code == 0) {
            let data = res.data

            let availableBalance = 0.0
            if (data.core_liquid_balance) {
                availableBalance = parseFloat(data.core_liquid_balance.slice(0,-4))
            }
            let redeemBalance = 0
            let netBalance = data.net_weight / 10000
            let cpuBalance = data.cpu_weight / 10000
            //总资产
            let totalBalance = availableBalance + redeemBalance + netBalance + cpuBalance
            $("#my-total-balance").text(totalBalance + " EOS")

            //余额
            let myBalanceTable = $("#my-balance-table")
            let rowTr = `<tr>
                    <td>${availableBalance} EOS</td>
                    <td>${redeemBalance} EOS</td>
                    <td>${netBalance} EOS</td>
                    <td>${cpuBalance} EOS</td>
                </tr>`
            myBalanceTable.append(rowTr)

            //RAM
            let ramAvailable = (data.ram_quota - data.ram_usage) / 1024
            let ramTotal = data.ram_quota / 1024
            let myramTable = $("#my-ram-table")
            rowTr = `<tr>
                    <td>${ramAvailable.toFixed(2)} KB</td>
                    <td>${ramTotal.toFixed(2)} KB</td>
                </tr>`
            myramTable.append(rowTr)

            //NET
            let netAvailable = (data.net_limit.max - data.net_limit.used)/1024           
            let netTotla = data.net_limit.max/1024            
            let myNetTable = $("#my-net-table")
            rowTr = `<tr>
                    <td>${netBalance} EOS</td>
                    <td>${netAvailable.toFixed(2)} KB</td>
                    <td>${netTotla.toFixed(2)} KB</td>
                </tr>`
            myNetTable.append(rowTr)

            //CPU
            let cpuAvailable = (data.cpu_limit.max - data.cpu_limit.used) / 1000     
            let cpuTotla = data.cpu_limit.max / 1000        
            let myCpuTable = $("#my-cpu-table")
            rowTr = `<tr>
                    <td>${cpuBalance} EOS</td>
                    <td>${cpuAvailable} ms</td>
                    <td>${cpuTotla} ms</td>
                </tr>`
            myCpuTable.append(rowTr)   
        }
    })


    $("input[name=account][hidden=hidden]").val(currentAccount)
    let currentwallet = localStorage.getItem("currentwallet")
    let walletPassword = localStorage.getItem(currentwallet)
    $("input[name=wallet][hidden=hidden]").val(currentwallet)
    $("input[name=password][hidden=hidden]").val(walletPassword)

    $("input[name=transaction_type]").change(function () {
        if (this.value == 1) {
            $("#ram-transaction-button").text("买入")
            $("input[name=amount]").attr({"placeholder":"请输入EOS数量"})
        } else {
            $("#ram-transaction-button").text("卖出")
            $("input[name=amount]").attr({"placeholder":"请输入RAM(KB)数量"})

        }
    })

    //ram全局数据
    $.post("/net_resource/ram/info", { "account": currentAccount }, function (res, status) {
        console.log(status + JSON.stringify(res))
        if (res.code == 0) {
            $("#ram-total").text(res.data.ramAvailable.toFixed(2) + " GB / " + res.data.ramTotal.toFixed(2) + "GB")
            $("#ram-price").text(res.data.ramPrice.toFixed(6))
        }
    })

    //交易RAM
    $("#ram-transaction").validate({
        rules: {
            amount: {required: true,},
        },
        messages: {
            name: {required: "请输入要交易的数量",},
        },
        submitHandler: function (form) {
            $(form).ajaxSubmit({
                url: "/net_resource/ram/transaction",
                type: "post",
                dataType: "json",
                success: function (res, status) {
                    console.log(status + JSON.stringify(res))
                    if (res.code == 0) {
                        alert("交易成功")
                        location.reload() 
                    }　else {
                        alert("交易失败")
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