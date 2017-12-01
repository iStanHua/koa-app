
const news = require('../controllers/news')

module.exports = function (router) {
    router.prefix('/news')

    router.get('/query', news.query)
    router.get('/detail/:id', news.detail)
}
