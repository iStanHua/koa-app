const service = require('./index')
const error = require('../error')
const validate = require('../util/validate')
const md5 = require('../util/md5')
const token = require('../util/token')

const mod = 'user'
const checkField = {
    /**
     * 检查密码
     * @param {String} value 密码
     */
    password: (value) => {
        if (!value) {
            return '密码不可为空'
        }
        if (value.length < 8 || value.length > 20) {
            return '密码长度须在8-20位之间'
        }
        if (!validate.password(value)) {
            return '密码须包含字母、数字和特殊字符'
        }
        return false
    },
    /**
     * 检查用户名
     * @param {String} value 用户名
     */
    name: (value) => {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve('用户名不可为空')
            }
            if (value.length < 3 || value.length > 16) {
                resolve('用户名长度在3-16位之间')
            }
            if (validate.pureNumber(value)) {
                resolve('用户名不能为纯数字')
            }
            try {
                let res = await service.count(mod, { where: { name: value } })
                if (res) {
                    resolve('该用户名已被注册')
                } else {
                    resolve(false)
                }
            } catch (e) {
                resolve('数据库查询失败')
            }
        })
    },
    /**
     * 检查手机号码
     * @param {Number} value 号码
     */
    phoneNumber: (value) => {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve('手机号码不可为空')
            }
            if (typeof value === 'number') {
                resolve('手机号码格式有误')
            }
            if (!validate.phoneNumber(value)) {
                resolve('无效的手机号码')
            }
            try {
                let res = await service.count(mod, { where: { phone_number: value } })
                if (res) {
                    resolve('该手机号已被注册')
                } else {
                    resolve(false)
                }
            } catch (e) {
                resolve('数据库查询失败')
            }
        })
    },
    /**
     * 检查邮箱
     * @param {String} value 邮箱
     */
    email: (value) => {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve('邮箱不可为空')
            }
            if (!validate.email(value)) {
                resolve('邮箱格式有误')
            }
            try {
                let res = await service.count(mod, { where: { email: value } })
                if (res) {
                    resolve('该邮箱已被注册')
                } else {
                    resolve(false)
                }
            } catch (e) {
                resolve('数据库查询失败')
            }
        })
    }
}

exports.validate = validate
/**
 * 新增用户
 * @param {Object} data 用户数据
 * @returns result
 */
exports.add = async (data) => {
    if (!data.name) {
        data.name = Math.random().toString(16).substring(4)
    }
    let result = {}
    if (data.phone_number) {
        result.msg = await checkField.phoneNumber(data.phone_number)
    }
    else if (data.email) {
        result.msg = await checkField.email(data.email)
    }
    else if (data.password) {
        result.msg = await checkField.password(data.password)
        if (!result.msg) {
            data.password = md5(data.password)
        }
    }
    else if (data.name) {
        result.msg = await checkField.name(data.name)
    }
    if (result.msg) {
        result.code = 400
    }
    else {
        result = await service.add(mod, data)
    }
    return result
}
/**
 * 用户登录
 * @param {Object} data 用户数据
 */
exports.login = async (data) => {
    let result = {}
    let _options = {
        where: {
            active: 1,
        },
        attributes: {
            exclude: ['password', 'active']
        }
    }
    if (data.phone_number) {
        _options.where.phone_number = data.phone_number
        let res = await service.count(mod, _options)
        if (!res) {
            result.msg = '该手机号不存在'
        }
    }
    else if (data.email) {
        _options.where.email = data.email
        let res = await service.count(mod, _options)
        if (!res) {
            result.msg = '该邮箱不存在'
        }
    }
    else {
        result.msg = '请输入正确的手机号或邮箱'
    }
    _options.where.password = md5(data.password)
    if (result.msg) {
        result.code = 400
    }
    else {
        console.log(_options)
        result = await service.findOne(mod, _options)
        if (!result) {
            result = { code: 400, msg: '密码不正确' }
        }
        else {
            let _token = token.create(result)
            result.dataValues.token = _token
            ctx.session.token = _token
        }
    }
    return result
}

/**
 * 删除用户
 * @param {Number} id     用户编号
 * @param {Boolean} flag  是否真删
 * @returns result
 */
exports.delete = async (id, flag = false) => {
    let options = { where: { id: id } }
    let count = await service.count(mod, options)
    if (!count) {
        return { code: 400, msg: '用户不存在' }
    }
    if (flag) {
        let result = await service.delete(mod, options)
        return result
    }
    else {
        let result = await update(id, { atcive: 0 })
        return result
    }
}
/**
 * 修改用户信息
 * @param {Number} id   用户编号
 * @param {Object} data 数据
 * @returns result
 */
exports.update = async (id, data) => {
    let options = { where: { id: id } }
    let count = await service.count(mod, options)
    if (!count) {
        return { code: 400, msg: '用户不存在' }
    }
    let result = await service.update(mod, data, options)
    return result
}

/**
 * 查用户详情
 * @param {Number} id 用户编号
 * @returns result 
 */
exports.findById = async (id) => {
    let result = await service.findOne(mod, {
        where: {
            id: id,
            active: 1
        },
        attributes: {
            exclude: ['password', 'active']
        }
    })
    return result
}
/**
 * 查用户列表
 * @param {Number} page_index 页码索引
 * @param {Number} page_size  每页显示记录数
 * @returns result
 */
exports.findAndCountAll = async (page_index, page_size) => {
    page_index = page_index || 1
    page_size = page_size || 10
    let _options = {
        where: {
            active: 1
        },
        attributes: {
            exclude: ['password', 'active']
        },
        offset: (page_index - 1) * page_size,
        limit: page_size,
        order: [['created_time', 'DESC']]
    }
    let result = await service.findAndCountAll(mod, _options)
    return result
}
