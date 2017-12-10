
const router = require('koa-router')()

const user = require('./user')
const news = require('./news')
const yicai = require('./yicai')

router.prefix('/api')

router.use(user.routes(), user.allowedMethods())
router.use(news.routes(), news.allowedMethods())
router.use(yicai.routes(), yicai.allowedMethods())

module.exports = router