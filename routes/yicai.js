const router = require('koa-router')()
const yicai = require('../controllers/yicai')

router.prefix('/yicai')

router.get('/news', yicai.news)
router.get('/news/:id', yicai.news)
router.get('/data', yicai.data)
router.get('/richrank', yicai.richrank)
router.get('/channel/:en', yicai.channel)

module.exports = router