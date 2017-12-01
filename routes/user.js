
const user = require('../controllers/user')

module.exports = function (router) {
    router.prefix('/user')

    router.post('/register', user.register)
    router.post('/login', user.login)
    router.get('/query', user.query)
    router.get('/detail/:id', user.detail)
}
