
const router = require('koa-router')()

const user = require('./user')
const news = require('./news')
const yicai = require('./yicai')
const wx = require('./wx')

router.prefix('/api')

router.use(user.routes(), user.allowedMethods())
router.use(news.routes(), news.allowedMethods())
router.use(yicai.routes(), yicai.allowedMethods())
router.use(wx.routes(), wx.allowedMethods())

module.exports = router