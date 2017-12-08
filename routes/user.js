const router = require('koa-router')()
const user = require('../controllers/user')

router.prefix('/user')

router.post('/register', user.register)
router.post('/login', user.login)
router.post('/logout', user.logout)
router.get('/delete/:id', user.delete)
router.get('/query', user.query)
router.get('/detail/:id', user.detail)

module.exports = router 