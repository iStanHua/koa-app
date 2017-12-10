const db = require('../models')
const news = db.news

/**
 * 查询新闻
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.query = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  let { page_index, page_size } = ctx.query
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
      model: db.user,
      attributes: ['id', 'name', 'avatar']
    }],
    offset: (page_index - 1) * page_size,
    limit: page_size,
    order: [['created_time', 'DESC']]
  }
  try {
    let result = await news.findAndCountAll(_options)
    _body.data = result
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
/**
 * 新闻详情
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
      let result = await news.findOne({
        where: {
          id: id
        },
        attributes: {
          exclude: ['is_public', 'user_id']
        },
        include: [{
          model: db.user,
          attributes: ['id', 'name', 'avatar']
        }],
      })
      _body.data = result
      if (!result) {
        _body.msg = `not found`
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
  let _body = { code: 200, msg: '' }
  let { id } = ctx.params
  if (isNaN(id)) {
    _body = error.INVALID_FIELD
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