const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const session = require('koa-session2')
const onerror = require('koa-onerror')
// 传参获取
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 跨域处理
const cors = require('koa-cors')
// 路由mount
const mount = require('koa-mount')

const routes = require('./routes')
const token = require('./util/token')
const exportFormat = require('./util/exportFormat')

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
app.use(session({
  key: 'SESSION_KOA_ID',
  maxAge: 60 * 60 * 1000 // (60分钟有效期)
}))

app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  try {
    const start = new Date()
    // if (!ctx.header.authorization) {
    //   exportFormat.error(ctx, 400, '请登录')
    // } else {
    //   let isToken = await token.verify(ctx.header.authorization)
    //   ctx.request.userId = isToken.id
    //   ctx.request.userName = isToken.name
    // }
    console.log(ctx.header.authorization)
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.body = 'authenticate'
    } else {
      throw err
    }
  }
})

// router
app.use(routes.routes(), routes.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
