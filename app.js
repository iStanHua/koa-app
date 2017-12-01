const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// 传参获取
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 跨域处理
const cors = require('koa-cors')
// 路由mount
const mount = require('koa-mount')

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
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 挂载路由
app.use(mount('/api', require('./routes')))

// error-handling
app.on('error', (err, ctx) => {
  logUtil.logError(ctx, err, new Date())
  console.error('server error', err, ctx)
});

module.exports = app
