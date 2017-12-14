const channel = require('./index')('channel')
const error = require('../error')

/**
 * 新增频道
 * @param {Object} data 频道数据
 * @returns result
 */
exports.add = async (data) => {
    let result = await channel.add(data)
    return result
}
/**
 * 新增频道
 * @param {Object} options 频道数据
 * @returns result
 */
exports.findOrCreate = async (options) => {
    let result = await channel.findOrCreate(options)
    return result
}