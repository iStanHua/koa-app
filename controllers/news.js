const news = require('../services/news')
const exportFormat = require('../util/exportFormat')
const error = require('../error')
/**
 * 新增新闻
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.add = async (ctx, next) => {
  let _body = { code: 200, msg: '新增成功' }
  try {
    let result = await news.add({})
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
 * 查询新闻
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.query = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  try {
    let { page_index, page_size } = ctx.query
    let result = await news.findAndCountAll(page_index, page_size)
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
 * 新闻详情
 * @param {Object} ctx  上下文
 * @param {Function} next
 */
exports.detail = async (ctx, next) => {
  let { id } = ctx.params
  id = Number(id)
  let _body = { code: 200, msg: '查询成功' }
  if (isNaN(id)) {
    _body = error.INVALID_FIELD
  }
  else {
    try {
      let result = await news.findById(id)
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


/**
* 批量新增Yicai新闻
 * @param {Object} ctx  上下文
 * @param {Function} next
*/
exports.batchAddYicaiNews = async (ctx, next) => {
  let _body = { code: 200, msg: '批量新增成功' }
  try {
    let result = await news.batchAddYicaiNews()
    if (result.code) {
      _body = result
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
* 批量新增新闻
 * @param {Object} ctx  上下文
 * @param {Function} next
*/
exports.batchAddYicaiData = async (ctx, next) => {
  let _body = { code: 200, msg: '批量新增成功' }
  try {
    let result = await news.batchAddYicaiData()
    if (result.code) {
      _body = result
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