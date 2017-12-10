const yicai = require('../services/yicai')
const exportFormat = require('../util/exportFormat')
const error = require('../error')

/**
 * 新闻列表
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.news = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  try {
    let { id } = ctx.params
    let result = null
    if (id) {
      id = Number(id)
      if (isNaN(id)) {
        _body = error.INVALID_FIELD
      }
      else {
        result = await yicai.newsDetail(id)
      }
    }
    else {
      result = await yicai.news()
    }
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
 * 数据列表
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.data = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  try {
    let result = await yicai.data()
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
 * 财富榜
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.richrank = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  try {
    let result = await yicai.richrank()
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
 * 频道列表
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.channel = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  try {
    let { en } = ctx.params
    let result = await yicai.channel(en)
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