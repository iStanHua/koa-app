const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// 传参获取
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 跨域处理
const cors = require('koa-cors')

const logUtil = require('./util/log')

const index = require('./routes/index')
const user = require('./routes/user')

const app = new Koa()
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors())

app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  let ms
  try {
    await next()
    ms = new Date() - start
    // 记录响应日志
    logUtil.logResponse(ctx, ms)
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  } catch (error) {
    ms = new Date() - start
    // 记录异常日志
    logUtil.logError(ctx, error, ms)
  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  logUtil.logError(ctx, err, new Date())
  console.error('server error', err, ctx)
});

module.exports = app
