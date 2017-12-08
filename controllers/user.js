const user = require('../services/user')
const exportFormat = require('../util/exportFormat')
const error = require('../error')

const userMod = 'user'

/**
 * 用户注册
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.register = async (ctx, next) => {
  let _body = { code: 200, msg: '注册成功' }
  try {
    const { phoneNumber, email, password } = ctx.request.body
    let _data = {}
    if (phoneNumber) {
      _data.phone_number = phoneNumber
    }
    else if (email) {
      _data.email = email
    }
    _data.password = password
    let result = await user.add(_data)
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
 * 用户登录
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.login = async (ctx, next) => {
  let _body = { code: 200, msg: '登录成功' }
  try {
    let _data = {}
    const { userName, password } = ctx.request.body
    if (user.validate.phoneNumber(userName)) {
      _data.phone_number = userName
    }
    else if (user.validate.email(userName)) {
      _data.email = userName
    }
    _data.password = password

    let result = await user.login(_data)
    if (result.code) {
      _body = result
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
 * 用户退出
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.logout = async (ctx, next) => {
  ctx.status = 200
  let _body = { code: 200, msg: '' }
  try {
    ctx.session = {}
    _body.msg = '退出成功'
  } catch (e) {
    _body.code = 500
    _body.msg = 'internal server error'
    ctx.app.emit('error', e, ctx)
  } finally {
    ctx.body = _body
  }
}
/**
 * 删除用户
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.delete = async (ctx, next) => {
  let _body = { code: 200, msg: '' }
  let { id } = ctx.params
  id = Number(id)
  if (isNaN(id)) {
    _body = error.INVALID_FIELD
  }
  else {
    try {
      let result = await user.delete(id)
      if (result.code) {
        _body = result
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
}
/**
 * 修改密码
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.updatePassword = async (ctx, next) => {
  let _body = { code: 200, msg: '' }
  const { phoneNumber, email, password } = ctx.request.body
  let _options = {}

  if (phoneNumber) {
    _body.msg = await user.checkField.phoneNumber(phoneNumber)
    _options.phone_number = phoneNumber
  }
  else if (email) {
    _body.msg = await user.checkField.email(email)
    _options.email = email
  }
  if (!_body.msg) {
    _body.msg = user.checkField.password(password)
    if (!_body.msg) {
      _options.password = md5(password)
    }
  }
  try {
    if (_body.msg) {
      _body.code = 400
    }
    else {
      console.log(_options)
      let result = await user.add(_options)
    }
  } catch (e) {
    _body = error.SERVER_EORROR
    ctx.app.emit('error', e, ctx)
  } finally {
    exportFormat.success(ctx, _body)
  }
}
/**
 * 查询用户
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.query = async (ctx, next) => {
  let _body = { code: 200, msg: '' }
  let { page_index, page_size } = ctx.request.body
  try {
    let result = await user.findAndCountAll(page_index, page_size)
    _body.data = result
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
 * 用户详情
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.detail = async (ctx, next) => {
  let _body = { code: 200, msg: '' }
  let { id } = ctx.params
  id = Number(id)
  if (isNaN(id)) {
    _body = error.INVALID_FIELD
  }
  else {
    try {
      let result = await user.findById(id)
      _body.data = result
      if (!result) {
        _body = error.NO_DATA
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
}