const router = require('koa-router')()
const weather = require('../controllers/weather')

router.prefix('/weather')

router.get('/query', weather.query)
router.get('/query/:code', weather.query)

module.exports = router