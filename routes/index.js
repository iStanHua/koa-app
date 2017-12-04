
const router = require('koa-router')()

const user = require('./user')
const news = require('./news')

module.exports = app => {
    app.use(user.routes(), user.allowedMethods())
    app.use(news.routes(), news.allowedMethods())
}