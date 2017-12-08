
const router = require('koa-router')()

const user = require('./user')
const news = require('./news')

router.prefix('/api')

router.use(user.routes(), user.allowedMethods())
router.use(news.routes(), news.allowedMethods())

module.exports = router