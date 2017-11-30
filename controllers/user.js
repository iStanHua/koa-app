const user = require('../models/').user

const userCtr = {}

userCtr.userList = async (ctx, next) => {
  let body = { code: '200', result: '' }
  try {
    let page_index = ctx.request.body.page_index || 1
    let page_size = ctx.request.body.page_size || 10
    let condition = {
      limit: [(page_index - 1) * page_size, +page_size],
    }
    if (ctx.request.body.sort) {
      (ctx.request.body.sort === 'pop') && (condition.order = [['id', 'DESC']])
        (ctx.request.body.sort === 'last') && (condition.order = [['created_time', 'DESC']])
    }
    let result = await user.findAndCountAll(dreamSequelize, condition)
    body.result = result;
  } catch (e) {
    body.code = '400'
    body.result = e.message
  } finally {
    ctx.body = body
  }
}

module.exports = userCtr