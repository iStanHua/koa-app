const axios = require('axios')

// http request 拦截器
axios.interceptors.request.use(
    config => {
        // let _token = store.getters.userInfo.token
        // if (_token) {
        //     config.headers.common['authorization'] = _token
        // }
        config.withCredentials = true
        return config
    }, (err) => {
        return Promise.reject(err)
    }
)
// http response 拦截器
axios.interceptors.response.use((response) => {
    // token 已过期，重定向到登录页面
    if (response.data.code == 401) {

    }
    return response
}, (err) => {
    return Promise.reject(err)
})
/**
 * 
 * @param {String} url    请求地址
 * @param {String*} type  请求类型
 * @param {Object} data   请求数据
 */
exports.http = (url, type = 'get', data) => {
    return new Promise((resolve, reject) => {
        let _options = {
            method: type,
            url: url
        }
        if (type === 'get') {
            _options.params = data
        }
        else if (type === 'post') {
            _options.data = data
        }
        axios(_options)
            .then(res => {
                let _data = res.data
                // 请求接口成功
                if (res.status == 200) {
                    resolve(_data)
                }
                else {
                    reject({ code: res.status, msg: res.message })
                }
            })
            .catch(res => {
                reject({ code: 404, msg: res.message })
            })
    })
}
