const router = require('koa-router')()
const user = require('../controllers/user')

router.prefix('/api/user')

router.post('/register', user.register)
router.post('/login', user.login)
router.post('/logout', user.logout)
router.get('/query', user.query)
router.get('/detail/:id', user.detail)
router.get('/news/:id', user.news)

module.exports = router
