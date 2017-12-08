const router = require('koa-router')()
const news = require('../controllers/news')

router.prefix('/news')

router.get('/query', news.query)
router.get('/detail/:id', news.detail)

module.exports = router