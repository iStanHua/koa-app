const router = require('koa-router')()
const user = require('../controllers/user')

router.prefix('/user')


/**
 * 添加用户
 */
router.post('/add', async (ctx, next) => {
    try {
        var data = await user.addUser(ctx, next);
        status.successTemp(ctx, 200, data);
    } catch (e) {
        console.log(e)
        status.catchError(ctx, 400, e.message);
    }
})


/**
 * 用户登录
 */
router.post('/login', async (ctx, next) => {
    try {
        var data = await user.login(ctx, next);
        status.successTemp(ctx, 200, data);
    } catch (e) {
        status.catchError(ctx, 400, e.message);
    }
})


module.exports = router
