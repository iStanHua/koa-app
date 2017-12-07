const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const session = require('koa-session')
const onerror = require('koa-onerror')
// 传参获取
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// 跨域处理
const cors = require('koa-cors')
// 路由mount
const mount = require('koa-mount')

const routes = require('./routes')

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

app.keys = ['koa', 'mysql', 'stanhua'];
const CONFIG = {
  key: 'USER:SESS', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
}

app.use(session(CONFIG, app))

app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  try {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      ctx.body = 'cant haz that'
    } else {
      throw err
    }
  }
})

// router
routes(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
