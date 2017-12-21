const weather = require('../cheerios/weather')
const exportFormat = require('../util/exportFormat')
const error = require('../error')

/**
 * 本地天气
 */
exports.query = async (ctx, next) => {
  let _body = { code: 200, msg: '查询成功' }
  try {
    let { code } = ctx.params
    let result = null
    if (code) {
      result = await weather.query(code)
    }
    else {
      result = await weather.query()
    }
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