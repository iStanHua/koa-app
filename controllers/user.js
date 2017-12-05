const db = require('../models')
const User = db.User

const md5 = require('../util/md5')

const check = {
  /**
   * 检查密码
   * @param {String} value 密码
   */
  password: (value) => {
    let charOrNumber = /[A-z]*[a-zA-Z][0-9][A-z0-9][_.@]*/.test(value)
    if (!value) {
      return '密码不可为空'
    }
    if (value.length < 8 || value.length > 20) {
      return '密码长度须在8-20位之间'
    }
    if (!charOrNumber) {
      return '密码须包含字母、下划线、@和数字'
    }
    return false
  },
  /**
   * 检查用户名
   * @param {String} value 用户名
   */
  name: (value) => {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve('用户名不可为空')
      }
      if (value.length < 3 || value.length > 16) {
        resolve('用户名长度在3-16位之间')
      }
      if (/^[0-9]*$/.test(value)) {
        resolve('用户名不能为纯数字')
      }
      try {
        let res = await User.findOne({
          where: {
            name: value
          }
        })
        if (res) {
          resolve('该用户名已被注册')
        } else {
          resolve(false)
        }
      } catch (e) {
        resolve('数据库查询失败')
      }
    })
  },
  /**
   * 检查手机号码
   * @param {Number} value 号码
   */
  phoneNumber: (value) => {
    return new Promise(async (resolve, reject) => {
      let isNumber = /^1[3|5|6|7|8|9][0,9]{9}$/.test(value)
      if (!value) {
        resolve('手机号码不可为空')
      }
      if (typeof value === 'number') {
        resolve('手机号码格式有误')
      }
      if (!isNumber) {
        resolve('无效的手机号码')
      }
      try {
        let res = await User.findOne({
          where: {
            phoneNumber: value
          }
        })
        if (res) {
          resolve('该手机号已被注册')
        } else {
          resolve(false)
        }
      } catch (e) {
        resolve('数据库查询失败')
      }
    })
  },
  /**
   * 检查邮箱
   * @param {String} value 邮箱
   */
  email: (value) => {
    return new Promise(async (resolve, reject) => {
      let isEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)
      if (!value) {
        resolve('邮箱不可为空')
      }
      if (!isEmail) {
        resolve('邮箱格式有误')
      }
      try {
        let res = await User.findOne({
          where: {
            email: value
          }
        })
        if (res) {
          resolve('该邮箱已被注册')
        } else {
          resolve(false)
        }
      } catch (e) {
        resolve('数据库查询失败')
      }
    })
  }
}

/**
 * 用户注册
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.register = async (ctx, next) => {
  let _body = { code: 200, msg: '注册成功' }
  const { phone_number, email, password } = ctx.request.body
  let _msg = ''
  let _options = {}

  if (phone_number) {
    _msg = await check.phoneNumber(phone_number)
    if (!_msg) {
      _msg = check.password(password)
    }
    _options = {
      phoneNumber: phone_number,
      password: md5(password)
    }
  }
  else if (email) {
    _msg = await check.email(email)
    if (!_msg) {
      _msg = check.password(password)
    }
    _options = {
      email: email,
      password: md5(password)
    }
  }
  try {
    if (_msg) {
      ctx.status = 400
      _body.code = 400
      _body.msg = _msg
      return
    }
    let result = await User.create(_options)
    // _body.data = result
  } catch (e) {
    ctx.status = e.status || 500
    _body.code = e.status || 500
    _body.msg = e.message
    ctx.app.emit('error', e, ctx)
  } finally {
    ctx.body = _body
  }
}
/**
 * 用户登录
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.login = async (ctx, next) => {
  let _body = { code: 200, msg: '登录成功' }
  const { phone_number, email, password } = ctx.request.body
  let _msg = ''
  let _options = {}

  if (phone_number) {
    _msg = await check.phoneNumber(phone_number)
    if (!_msg) {
      _msg = check.password(password)
    }
    _options = {
      phone_number: phone_number,
      password: password
    }
  }
  else if (email) {
    _msg = await check.email(email)
    if (!_msg) {
      _msg = check.password(password)
    }
    _options = {
      email: email,
      password: password
    }
  }
  try {
    let result = await User.findAll(_options)
    _body.data = result
  } catch (e) {
    ctx.status = e.status || 500
    _body.code = e.status || 500
    _body.msg = e.message
    ctx.app.emit('error', e, ctx)
  } finally {
    ctx.body = _body
  }
}
/**
 * 查询用户
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.query = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  let page_index = ctx.request.body.page_index || 1
  let page_size = ctx.request.body.page_size || 10
  let _options = {
    where: {
      active: 1
    },
    attributes: {
      exclude: ['password', 'active', 'deletedTime']
    },
    offset: (page_index - 1) * page_size,
    limit: page_size,
    order: [['created_time', 'DESC']]
  }
  try {
    let result = await User.findAndCountAll(_options)
    _body.data = result
  }
  catch (e) {
    ctx.status = e.status || 500
    _body.code = e.status || 500
    _body.msg = e.message
    ctx.app.emit('error', e, ctx)
  }
  finally {
    ctx.body = _body
  }
}
/**
 * 用户详情
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.detail = async (ctx, next) => {
  let { id } = ctx.params
  id = Number(id)
  let _body = { code: 200, msg: '查询成功' }
  if (isNaN(id)) {
    ctx.status = 400
    _body.code = 400
    _body.msg = 'bad request'
    ctx.body = _body
  }
  else {
    try {
      let result = await User.findById(id)
      _body.data = result
      if (!result) {
        _body.msg = `id=${id} not found`
      }
    }
    catch (e) {
      ctx.status = e.status || 500
      _body.code = e.status || 500
      _body.msg = 'internal server error'
      ctx.app.emit('error', e, ctx)
    }
    finally {
      ctx.body = _body
    }
  }
}
/**
 * 用户新闻列表
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.news = async (ctx, next) => {
  let { id } = ctx.params
  id = Number(id)
  let _body = { code: 200, msg: '查询成功' }
  if (isNaN(id)) {
    ctx.status = 400
    _body.code = 400
    _body.msg = 'bad request'
    ctx.body = _body
  }
  else {
    try {
      let _options = {
        where: {
          id: id
        },
        attributes: {
          exclude: ['password', 'active', 'deletedTime']
        },
        offset: (page_index - 1) * page_size,
        limit: page_size,
        order: [['created_time', 'DESC']]
      }
      let result = await User.findAll(_options)
      _body.data = result
      if (!result) {
        _body.msg = `id=${id} not found`
      }
    }
    catch (e) {
      ctx.status = e.status || 500
      _body.code = e.status || 500
      _body.msg = 'internal server error'
      ctx.app.emit('error', e, ctx)
    }
    finally {
      ctx.body = _body
    }
  }
}