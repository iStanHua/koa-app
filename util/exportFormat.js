// 接口格式化输出
module.exports = {
    error: (ctx, code, msg) => {
        ctx.status = 200
        ctx.body = {
            code: code || 500,
            msg: msg || 'internal server error'
        }
    },
    success: (ctx, data) => {
        ctx.status = 200
        ctx.body = {
            code: data.code,
            msg: data.msg,
            data: data.data || null
        }
    }
}
