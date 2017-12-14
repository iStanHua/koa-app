const db = require('../models')

module.exports = (model) => {
    let service = {}
    service.db = db
    service.model = db[model]
    /**
     * 增
     * @param {Object} options 参数
     * @returns result
     */
    service.add = async (options = {}) => {
        let result = await service.model.create(options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 批量新增
     * @param {Array}  records  从中创建实例的对象列表（键/值对）
     * @returns result
     */
    service.bulkCreate = async (records = []) => {
        let result = await service.model.bulkCreate(records).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 删
     * @param {Object} options 参数
     * @returns result
     */
    service.delete = async (options = {}) => {
        let result = await service.model.destroy(options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 改
     * @param {Object} values    数据
     * @param {Object} options 参数
     * @returns result
     */
    service.update = async (values, options = {}) => {
        let result = await service.model.update(values, options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 增或改
     * @param {Object} values    数据
     * @param {Object} options 参数
     * @returns result
     */
    service.insertOrUpdate = async (values, options = {}) => {
        let result = await service.model.insertOrUpdate(values, options).catch(e => {
            throw new Error(e)
        })
        return result
    }

    /**
     * 搜索数据库中的一个特定元素
     * @param {Object} options 参数
     * @returns result 
     */
    service.findOne = async (options = {}) => {
        let result = await service.model.findOne(options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 找到与查询匹配的行，或者如果没有找到，则构建并保存该行
     * @param {Object} options 参数 (where,defaults)
     * @returns result 
     */
    service.findOrCreate = async (options = {}) => {
        let result = await service.model.findOrCreate(options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 在数据库中搜索多个元素，返回数据和总计数
     * @param {Object} options 参数 (page_index ,page_size)
     * @returns result 
     */
    service.findAndCountAll = async (options = {}) => {
        let result = await service.model.findAndCountAll(options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 记录数
     * @param {Object} options 参数
     * @returns result
     */
    service.count = async (options = {}) => {
        let result = await service.model.count(options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 找到字段的总和
     * @param {String} field   字段
     * @param {Object} options 参数
     * @returns result 
     */
    service.sum = async (field, options = {}) => {
        let result = await service.model.sum(field, options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 找到字段的最大值
     * @param {String} field   字段
     * @param {Object} options 参数
     * @returns result 
     */
    service.max = async (field, options = {}) => {
        let result = await service.model.max(field, options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    /**
     * 找到字段的最小值
     * @param {String} field   字段
     * @param {Object} options 参数
     * @returns result 
     */
    service.min = async (field, options = {}) => {
        let result = await service.model.min(field, options).catch(e => {
            throw new Error(e)
        })
        return result
    }
    return service
}