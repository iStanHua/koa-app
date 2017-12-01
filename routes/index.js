
const router = require('koa-router')()

const user = require('./user')(router)
const news = require('./news')(router)

module.exports = router.middleware()
