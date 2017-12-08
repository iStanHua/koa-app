const db = require('../models')

/**
 * 增
 * @param {Object} mod     模型
 * @param {Object} options 参数
 * @returns result
 */
exports.add = async (mod, options = {}) => {
    let result = await db[mod].create(options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 删
 * @param {Object} mod     模型
 * @param {Object} options 参数
 * @returns result
 */
exports.delete = async (mod, options = {}) => {
    let result = await db[mod].destroy(options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 改
 * @param {Object} mod     模型
 * @param {Object} data    数据
 * @param {Object} options 参数
 * @returns result
 */
exports.update = async (mod, data, options = {}) => {
    let result = await db[mod].update(data, options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 增或改
 * @param {Object} mod     模型
 * @param {Object} data    数据
 * @param {Object} options 参数
 * @returns result
 */
exports.insertOrUpdate = async (mod, data, options = {}) => {
    let result = await db[mod].insertOrUpdate(data, options).catch(e => {
        throw new Error(e)
    })
    return result
}

/**
 * 搜索数据库中的一个特定元素
 * @param {Object} mod     模型
 * @param {Object} options 参数
 * @returns result 
 */
exports.findOne = async (mod, options = {}) => {
    let result = await db[mod].findOne(options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 找到与查询匹配的行，或者如果没有找到，则构建并保存该行
 * @param {Object} mod     模型 （defaults）
 * @param {Object} options 参数
 * @returns result 
 */
exports.findOrCreate = async (mod, options = {}) => {
    let result = await db[mod].findOrCreate(options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 在数据库中搜索多个元素，返回数据和总计数
 * @param {Object} mod     模型
 * @param {Object} options 参数 (page_index ,page_size)
 * @returns result 
 */
exports.findAndCountAll = async (mod, options = {}) => {
    let result = await db[mod].findAndCountAll(options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 记录数
 * @param {Object} mod     模型
 * @param {Object} options 参数
 * @returns result
 */
exports.count = async (mod, options = {}) => {
    let result = await db[mod].count(options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 找到字段的总和
 * @param {Object} mod     模型
 * @param {String} field   字段
 * @param {Object} options 参数
 * @returns result 
 */
exports.sum = async (mod, field, options = {}) => {
    let result = await db[mod].sum(field, options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 找到字段的最大值
 * @param {Object} mod     模型
 * @param {String} field   字段
 * @param {Object} options 参数
 * @returns result 
 */
exports.max = async (mod, field, options = {}) => {
    let result = await db[mod].max(field, options).catch(e => {
        throw new Error(e)
    })
    return result
}
/**
 * 找到字段的最小值
 * @param {Object} mod     模型
 * @param {String} field   字段
 * @param {Object} options 参数
 * @returns result 
 */
exports.min = async (mod, field, options = {}) => {
    let result = await db[mod].min(field, options).catch(e => {
        throw new Error(e)
    })
    return result
}
