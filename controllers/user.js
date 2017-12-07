const db = require('../models')
const user = db.user

const md5 = require('../util/md5')
const token = require('../util/token')
const validate = require('../util/validate')

const check = {
  /**
   * 检查密码
   * @param {String} value 密码
   */
  password: (value) => {
    if (!value) {
      return '密码不可为空'
    }
    if (value.length < 8 || value.length > 20) {
      return '密码长度须在8-20位之间'
    }
    if (!validate.password(value)) {
      return '密码须包含字母、数字和特殊字符'
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
      if (validate.pureNumber(value)) {
        resolve('用户名不能为纯数字')
      }
      try {
        let res = await user.count({
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
      if (!value) {
        resolve('手机号码不可为空')
      }
      if (typeof value === 'number') {
        resolve('手机号码格式有误')
      }
      if (!validate.phoneNumber(value)) {
        resolve('无效的手机号码')
      }
      try {
        let res = await user.count({
          where: {
            phone_number: value
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
      if (!value) {
        resolve('邮箱不可为空')
      }
      if (!validate.email(value)) {
        resolve('邮箱格式有误')
      }
      try {
        let res = await user.count({
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
  ctx.status = 200
  let _body = { code: 200, msg: '注册成功' }
  const { phoneNumber, email, password } = ctx.request.body
  let _msg = ''
  let _options = {}


  if (phoneNumber) {
    _msg = await check.phoneNumber(phoneNumber)
    if (!_msg) {
    }
    _options = {
      phone_number: phoneNumber
    }
  }
  else if (email) {
    _msg = await check.email(email)
    _options = {
      email: email
    }
  }
  if (!_msg) {
    _msg = check.password(password)
    if (!_msg) {
      _options.password = md5(password)
    }
  }
  try {
    if (_msg) {
      _body.code = 400
      _body.msg = _msg
    }
    else {
      console.log(_options)
      let result = await user.create(_options)
      // _body.data = result
    }
  } catch (e) {
    _body.code = e.status || 500
    _body.msg = 'internal server error'
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
  ctx.status = 200
  let _body = { code: 200, msg: '' }
  const { userName, password } = ctx.request.body
  let _options = {
    where: {
      active: 1,
    },
    attributes: {
      exclude: ['password', 'active']
    }
  }
  if (validate.phoneNumber(userName)) {
    _options.where.phone_number = userName

    let res = await user.count(_options)
    if (!res) {
      _body.code = 400
      _body.msg = '该手机号不存在'
    }
  }
  else if (validate.email(userName)) {
    _options.where.email = userName
    let res = await user.count(_options)
    if (!res) {
      _body.code = 400
      _body.msg = '该邮箱不存在'
    }
  }
  else {
    _body.code = 400
    _body.msg = '请输入正确的手机号或邮箱'
  }
  try {
    if (!_body.msg) {
      _options.where.password = md5(password)
      let _res = await user.findOne(_options)
      if (!_res) {
        _body.code = 400
        _body.msg = '密码不正确'
      }
      else {
        _res.dataValues.token = token.create({
          username: userName
        })
        ctx.session.token = _res.dataValues.token
        _body.data = _res
        _body.msg = '登录成功'
      }
    }
  } catch (e) {
    _body.code = 500
    _body.msg = 'internal server error'
    ctx.app.emit('error', e, ctx)
  } finally {
    ctx.body = _body
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
    ctx.session = null
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
 * 查询用户
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.query = async (ctx, next) => {
  ctx.status = 200
  let _body = { code: 200, msg: '查询成功' }
  let { page_index, page_size } = ctx.request.body
  page_index = page_index || 1
  page_size = page_size || 10
  let _options = {
    where: {
      active: 1
    },
    attributes: {
      exclude: ['password', 'active']
    },
    offset: (page_index - 1) * page_size,
    limit: page_size,
    order: [['created_time', 'DESC']]
  }
  try {
    let result = await user.findAndCountAll(_options)
    _body.data = result
  }
  catch (e) {
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
  ctx.status = 200
  id = Number(id)
  let _body = { code: 200, msg: '查询成功' }
  if (isNaN(id)) {
    _body.code = 400
    _body.msg = 'bad request'
    ctx.body = _body
  }
  else {
    try {
      let result = await user.findOne({
        where: {
          id: id,
          active: 1
        },
        attributes: {
          exclude: ['password', 'active']
        }
      })
      _body.data = result
      if (!result) {
        _body.msg = `not found`
      }
    }
    catch (e) {
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
  ctx.status = 200
  let _body = { code: 200, msg: '查询成功' }
  let { id } = ctx.params
  if (isNaN(id)) {
    _body.code = 400
    _body.msg = 'bad request'
    ctx.body = _body
  }
  else {

    try {
      let { page_index, page_size } = ctx.request.body
      page_index = page_index || 1
      page_size = page_size || 10
      let _options = {
        where: {
          is_public: 1
        },
        attributes: {
          exclude: ['is_public', 'user_id']
        },
        include: [{
          model: user,
          where: {
            id: id
          },
          attributes: [],
        }],
        offset: (page_index - 1) * page_size,
        limit: page_size,
        order: [['created_time', 'DESC']]
      }
      let result = await db.news.findAndCountAll(_options)
      _body.data = result
      if (!result) {
        _body.msg = `not found`
      }
    }
    catch (e) {
      _body.code = e.status || 500
      _body.msg = 'internal server error'
      ctx.app.emit('error', e, ctx)
    }
    finally {
      ctx.body = _body
    }
  }
}