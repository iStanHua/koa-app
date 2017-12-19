const crypto = require('crypto')
const axios = require('../util/axios')
const exportFormat = require('../util/exportFormat')
const error = require('../error')

const baseUrl = 'https://api.weixin.qq.com'
const httpsUrl = baseUrl + '/cgi-bin'
const httpUrl = 'http://api.weixin.qq.com/cgi-bin'
const fileUrl = 'http://file.api.weixin.qq.com/cgi-bin'

// 通过 code 获取网页授权的 accessToken
// https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + this.appid + '&secret=' + this.appsecret + '&code=' + code + '&grant_type=authorization_code'
// 通过 refreshToken 重新获取 accessToken
// https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + this.appid + '&grant_type=refresh_token&refresh_token=' + refresh_token
// 通过网页收取后获取到的accessToken 去获取用户信息
// https://api.weixin.qq.com/sns/userinfo?access_token=' + oauthToken.accessToken + '&openid=' + openid + '&lang=zh_CN';

/**
 * 获取access_token
 * @param {String} appid  
 * @param {String} secret
 * @returns 接口凭证
 */
exports.accessToken = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { appid, secret } = ctx.query
        let _url = httpsUrl + `/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 获取ticket
 * @param {String} type          类型(jsapi,wx_card)
 * @param {String} access_token  调用接口凭证
 * @returns 接口凭证
 */
exports.getTicket = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { access_token, type } = ctx.query
        let _url = httpsUrl + `/ticket/getticket?access_token=${access_token}&type=${type}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 获取signature
 * @param {String} jsapi_ticket    
 * @param {String} url  
 * @returns 接口凭证
 */
exports.getSignature = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { jsapi_ticket, url } = ctx.query
        if (!jsapi_ticket && !url) {
            _body = error.INVALID_FIELD
        }
        else {
            const timestamp = Math.floor(Date.now() / 1000)
            const noncestr = Math.random().toString(36).substring(2)
            const source = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
            const signature = crypto.createHash('sha1').update(source).digest('hex')
            _body.data = { timestamp, noncestr, signature }
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}

/**
 * 多媒体文件上传接口
 * @param {String} access_token  调用接口凭证
 * @param {String} type          媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * @param {File}   media         form-data中媒体文件标识，有filename、filelength、content-type等信息
 * @returns media_id
 */
exports.uploadMedia = async (ctx, next) => {
    let _body = { code: 200, msg: '上传成功' }
    try {
        let { access_token, type, media } = ctx.request.body
        type = type || 'image,voice,video,thumb'
        let _url = fileUrl + `/media/upload?access_token=${access_token}&type=${type}&media=${media}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 下载多媒体文件接口
 * @param {String} access_token  调用接口凭证
 * @param {String} media_id      媒体文件id
 * @returns 
 */
exports.downloadMedia = async (ctx, next) => {
    let _body = { code: 200, msg: '下载成功' }
    try {
        let { access_token, media_id } = ctx.query
        let _url = fileUrl + `/media/get?access_token=${access_token}&media_id=${media_id}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 上传logo接口
 * @param {String} access_token  调用接口凭证
 * @param {File}   buffer        大小限制1MB，推荐像素为300*300，支持JPG格式
 * @returns 
 */
exports.uploadImg = async (ctx, next) => {
    let _body = { code: 200, msg: '上传成功' }
    try {
        let { access_token, buffer } = ctx.request.body
        let _url = httpUrl + + `/media/uploadimg?access_token=${access_token}&type=image&buffer=${buffer}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 发送客服消息
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.sendCustomMessage = async (ctx, next) => {
    let _body = { code: 200, msg: '发送成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/message/custom/send?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 获取关注者列表
 * @param {String} access_token  调用接口凭证
 * @param {String} next_openid   获取关注用户列表偏移量，不填默认从头开始拉取
 * @returns 
 */
exports.getUser = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { access_token, next_openid } = ctx.query
        let _url = httpsUrl + `/user/get?access_token=${access_token}&next_openid=${next_openid}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 获取用户基本信息
 * @param {String} access_token  调用接口凭证
 * @param {String} openid        目标用户的OPNEID
 * @returns 
 */
exports.userInfo = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { access_token, openid } = ctx.query
        let _url = httpsUrl + `/user/info?access_token=${access_token}&openid=${openid}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 创建分组
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.createGroup = async (ctx, next) => {
    let _body = { code: 200, msg: '创建成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/groups/create?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 修改分组
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.updateGroup = async (ctx, next) => {
    let _body = { code: 200, msg: '修改成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/groups/update?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 查询分组
 * @param {String} access_token  调用接口凭证
 * @returns 
 */
exports.getGroups = async (ctx, next) => {
    let _body = { code: 200, msg: '查询成功' }
    try {
        let { access_token } = ctx.query
        let _url = httpsUrl + `/groups/get?access_token=${access_token}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 移动用户分组
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.updateMembersGroup = async (ctx, next) => {
    let _body = { code: 200, msg: '移动用户成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/groups/members/update?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 查询用户分组id
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.getidGroup = async (ctx, next) => {
    let _body = { code: 200, msg: '查询成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/groups/getid?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 自定义菜单创建
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.createMenu = async (ctx, next) => {
    let _body = { code: 200, msg: '创建成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/menu/create?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 自定义菜单查询
 * @param {String} access_token  调用接口凭证
 * @returns 
 */
exports.getMenu = async (ctx, next) => {
    let _body = { code: 200, msg: '查询成功' }
    try {
        let { access_token } = ctx.query
        let _url = httpsUrl + `/menu/get?access_token=${access_token}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 自定义菜单删除
 * @param {String} access_token  调用接口凭证
 * @returns 
 */
exports.deleteMenu = async (ctx, next) => {
    let _body = { code: 200, msg: '删除成功' }
    try {
        let { access_token } = ctx.query
        let _url = httpsUrl + `/menu/delete?access_token=${access_token}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 创建二维码ticket
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.createQrcode = async (ctx, next) => {
    let _body = { code: 200, msg: '创建成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/qrcode/create?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 换取二维码
 * @param {String} ticket  获取的二维码ticket
 * @returns 
 */
exports.showQrcode = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { ticket } = ctx.query
        let _url = httpsUrl + `/showqrcode?ticket=${ticket}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设备授权-获取deviceid和二维码
 * @param {String} access_token  调用接口凭证
 * @returns 
 */
exports.getDeviceQrcode = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { access_token } = ctx.query
        let _url = httpsUrl + `/device/getqrcode?access_token=${access_token}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设备授权-获取deviceid和二维码
 * @param {String} access_token  调用接口凭证
 * @returns 
 */
exports.getDeviceQrcode = async (ctx, next) => {
    let _body = { code: 200, msg: '获取成功' }
    try {
        let { access_token } = ctx.query
        let _url = baseUrl + `/device/getqrcode?access_token=${access_token}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设备授权-利用deviceid更新设备属性
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.authorizeDevice = async (ctx, next) => {
    let _body = { code: 200, msg: '授权成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/device/authorize_device?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 验证设备二维码
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.verifyDeviceQrcode = async (ctx, next) => {
    let _body = { code: 200, msg: '验证成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/device/verify_qrcode?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 查询设备状态
 * @param {String} access_token  调用接口凭证
 * @param {String} device_id     设备ID
 * @returns 
 */
exports.getDeviceStatus = async (ctx, next) => {
    let _body = { code: 200, msg: '查询成功' }
    try {
        let { access_token, device_id } = ctx.query
        let _url = baseUrl + `/device/get_stat?access_token=${access_token}&device_id=${device_id}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设备绑定-绑定成功通知
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.bindDevice = async (ctx, next) => {
    let _body = { code: 200, msg: '绑定成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/device/bind?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设备绑定-强制绑定用户和设备
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.compelBindDevice = async (ctx, next) => {
    let _body = { code: 200, msg: '绑定成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/device/compel_bind?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设备解绑-解绑成功通知
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.unBindDevice = async (ctx, next) => {
    let _body = { code: 200, msg: '解绑成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/device/unbind?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设备解绑-强制解绑用户和设备
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.compelUnbindDevice = async (ctx, next) => {
    let _body = { code: 200, msg: '解绑成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/device/compel_unbind?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 查询设备绑定的用户
 * @param {String} access_token  调用接口凭证
 * @param {String} device_type   设备类型(公众账号原始ID)
 * @param {String} device_id     设备ID
 * @returns 
 */
exports.getDeviceOpenid = async (ctx, next) => {
    let _body = { code: 200, msg: '查询成功' }
    try {
        let { access_token, device_type, device_id } = ctx.query
        let _url = baseUrl + `/device/get_openid?access_token=${access_token}&device_type=${device_type}&device_id=${device_id}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 查询用户绑定的设备
 * @param {String} access_token  调用接口凭证
 * @param {String} openid        用户的openid
 * @returns 
 */
exports.getDeviceOpenidBind = async (ctx, next) => {
    let _body = { code: 200, msg: '查询成功' }
    try {
        let { access_token, openid } = ctx.query
        let _url = baseUrl + `/device/get_bind_device?access_token=${access_token}&openid=${openid}`
        let result = await axios.http(_url)
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 推送消息-发送设备消息
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.transmsgDevice = async (ctx, next) => {
    let _body = { code: 200, msg: '发送成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/device/transmsg?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 创建卡劵
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.createCard = async (ctx, next) => {
    let _body = { code: 200, msg: '创建成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/card/create?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 创建二维码ticket
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.createQrcodeCard = async (ctx, next) => {
    let _body = { code: 200, msg: '创建成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/card/qrcode/create?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 设置测试白名单
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.setTestwhitelistCard = async (ctx, next) => {
    let _body = { code: 200, msg: '设置成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/card/testwhitelist/set?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 核销卡劵
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.consumeCard = async (ctx, next) => {
    let _body = { code: 200, msg: '核销成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = baseUrl + `/card/code/consume?access_token=${access_token}&body=${body}"`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 打开已群发文章评论
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.openComment = async (ctx, next) => {
    let _body = { code: 200, msg: '打开成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/open?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 关闭已群发文章评论
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.closeComment = async (ctx, next) => {
    let _body = { code: 200, msg: '关闭成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/close?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 查看文章评论数据
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.commentlist = async (ctx, next) => {
    let _body = { code: 200, msg: '查看成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/list?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 精选评论
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.markelectComment = async (ctx, next) => {
    let _body = { code: 200, msg: '查看成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/markelect?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 取消精选评论
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.unmarkelectComment = async (ctx, next) => {
    let _body = { code: 200, msg: '取消成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/unmarkelect?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 删除评论
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.deleteComment = async (ctx, next) => {
    let _body = { code: 200, msg: '删除成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/delete?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 回复评论
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.addReplyComment = async (ctx, next) => {
    let _body = { code: 200, msg: '回复成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/reply/add?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}
/**
 * 删除回复评论
 * @param {String} access_token  调用接口凭证
 * @param {JSON}   body          调用接口的数据json包
 * @returns 
 */
exports.deleteReplyComment = async (ctx, next) => {
    let _body = { code: 200, msg: '删除成功' }
    try {
        let { access_token, body } = ctx.request.body
        let _url = httpsUrl + `/comment/reply/delete?access_token=${access_token}&body=${body}`
        let result = await axios.http(_url, 'post')
        if (result.errcode) {
            _body.code = result.errcode
            _body.msg = result.errmsg
        }
        else {
            _body.data = result
        }
    }
    catch (e) {
        _body = error.SERVER_EORROR
        ctx.app.emit('error', e, ctx)
    }
    finally {
        exportFormat.success(ctx, _body)
    }
}