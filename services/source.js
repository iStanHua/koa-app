const source = require('./index')('source')
const error = require('../error')

/**
 * 新增来源
 * @param {Object} data 来源数据
 * @returns result
 */
exports.add = async (data) => {
    let result = await source.add(data)
    return result
}
/**
 * 新增来源
 * @param {Object} options 来源数据
 * @returns result
 */
exports.findOrCreate = async (options) => {
    let result = await source.findOrCreate(options)
    return result
}