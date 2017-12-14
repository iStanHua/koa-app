const router = require('koa-router')()
const news = require('../controllers/news')

router.prefix('/news')

router.get('/add', news.add)
router.get('/batch/add', news.batchAdd)
router.get('/query', news.query)
router.get('/detail/:id', news.detail)

module.exports = router