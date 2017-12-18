const axios = require('../util/axios')
const exportFormat = require('../util/exportFormat')
const error = require('../error')

const httpsUrl = 'https://api.weixin.qq.com/cgi-bin'
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