

$(document).ready(function () {
    let currentAccount = localStorage.getItem("currentAccount")
    $("#current-account").text(currentAccount)

    //网络资源详情
    $.post("/account/info", { "account": currentAccount }, function (res, status) {
        console.log(status + JSON.stringify(res))
        if (res.code == 0) {
            let data = res.data

            let availableBalance = parseFloat(data.core_liquid_balance.slice(0,-4))
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

            //ARM
            let armAvailable = (data.ram_quota - data.ram_usage) / 1024
            let armTotal = data.ram_quota / 1024
            let myArmTable = $("#my-arm-table")
            rowTr = `<tr>
                    <td>${armAvailable.toFixed(2)} KB</td>
                    <td>${armTotal.toFixed(2)} KB</td>
                </tr>`
            myArmTable.append(rowTr)

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
})