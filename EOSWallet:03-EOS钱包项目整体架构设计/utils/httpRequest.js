
let request = require("request");
let {success, fail} = require("./myUtils")
let config = require("../config/config")

async function httpRequest(method, url, params) {
    console.log("httpRequest:", url, params)
    let promise = new Promise((resolve, reject) => {

        var options = { 
            method: method,
            url: url,
            body: params,
            json: true 
        };
        request(options, function (error, response, body) {

            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })

    let result;
    //第一个参数是成功的回调
    //第二个参数是失败的回调
    await promise.then(function (data) {
        if (data.error) {
            result = fail(data.error)
        } else {
            result = success(data)
        }
    }, function(error) {
        result = fail(error)
    })
    
    console.log(JSON.stringify(result))
    return result
}

function generateURL(path) {
    let domain = ""
    if (path.indexOf("/v1/wallet/") == 0) {
        domain = config.walletAddress
    } else {
        domain = config.eosconfig.httpEndpoint
    }
    return domain + path
}

module.exports = {

    postRequest: async(path, params) => {
        return await httpRequest("POST", generateURL(path), params)
    },

    getRequest: async(path, params) => {
        return await httpRequest("GET", generateURL(path), params)
    },

}