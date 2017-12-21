const news = require('./index')('news')
const channel = require('./index')('channel')
const source = require('./index')('source')
const user = require('./index')('user')
const yicai = require('../cheerios/yicai')
const error = require('../error')

/**
 * 新增新闻
 * @param {Object} data 新闻数据
 * @returns result
 */
exports.add = async (data) => {
    let result = await news.add(data)
    return result
}
/**
 * 批量新增新闻
 * @param {Object} data 新闻数据
 * @returns result
 */
exports.batchAddNews = async () => {
    let list = await yicai.news()
    list.forEach(async ele => {
        let detail = await yicai.newsDetail(ele.id)
        let _channel = await channel.findOrCreate({
            where: { name: ele.channel.name },
            defaults: {
                name: ele.channel.name,
                name_en: ele.channel.en
            }
        })
        let _source = await source.findOrCreate({
            where: { name: detail.source },
            defaults: {
                name: detail.source
            }
        })
        let data = {}
        data.news_id = ele.id
        data.title = ele.title
        data.title = ele.title
        data.abstract = ele.abstract
        data.content = detail.content
        data.image = ele.image
        data.channel_id = _channel[0].dataValues.id
        data.source_id = _source[0].dataValues.id
        data.editor = detail.editor
        data.user_id = 1
        data.created_time = ele.create_time
        data.updated_time = ele.create_time
        await news.findOrCreate({
            where: { news_id: ele.id },
            defaults: data
        })
    })
    return list
}
/**
 * 批量新增新闻
 * @param {Object} data 新闻数据
 * @returns result
 */
exports.batchAddData = async () => {
    let list = await yicai.data()
    list.forEach(async ele => {
        let detail = await yicai.newsDetail(ele.id)
        let _channel = await channel.findOrCreate({
            where: { name: ele.channel.name },
            defaults: {
                name: ele.channel.name,
                name_en: ele.channel.en
            }
        })
        let _source = await source.findOrCreate({
            where: { name: detail.source },
            defaults: {
                name: detail.source
            }
        })
        let data = {}
        data.news_id = ele.id
        data.title = ele.title
        data.title = ele.title
        data.abstract = ele.abstract
        data.content = detail.content
        data.image = ele.image
        data.channel_id = _channel[0].dataValues.id
        data.source_id = _source[0].dataValues.id
        data.editor = detail.editor
        data.user_id = 1
        data.created_time = ele.create_time
        data.updated_time = ele.create_time
        await news.findOrCreate({
            where: { news_id: ele.id },
            defaults: data
        })
    })
    return list
}
/**
 * 删除新闻
 * @param {Number} id     新闻编号
 * @param {Boolean} flag  是否真删
 * @returns result
 */
exports.delete = async (id, flag = false) => {
    let options = { where: { id: id } }
    let count = await news.count(options)
    if (!count) {
        return { code: 400, msg: '新闻不存在' }
    }
    if (flag) {
        let result = await news.delete(options)
        return result
    }
    else {
        let result = await update(id, { atcive: 0 })
        return result
    }
}
/**
 * 修改新闻信息
 * @param {Number} id   新闻编号
 * @param {Object} data 数据
 * @returns result
 */
exports.update = async (id, data) => {
    let options = { where: { id: id } }
    let count = await news.count(options)
    if (!count) {
        return { code: 400, msg: '新闻不存在' }
    }
    let result = await news.update(data, options)
    return result
}

/**
 * 查新闻详情
 * @param {Number} id 新闻编号
 * @returns result 
 */
exports.findById = async (id) => {
    let result = await news.findOne({
        where: {
            id: id,
            active: 1
        },
        attributes: {
            exclude: ['is_public', 'user_id', 'channel_id', 'source_id']
        },
        include: [{
            model: news.db.user,
            attributes: ['id', 'name', 'avatar']
        }, {
            model: news.db.channel,
            attributes: ['id', 'name', 'name_en']
        }, {
            model: news.db.source,
            attributes: ['id', 'name']
        }],
    })
    return result
}
/**
 * 查新闻列表
 * @param {Number} page_index 页码索引
 * @param {Number} page_size  每页显示记录数
 * @returns result
 */
exports.findAndCountAll = async (page_index, page_size) => {
    page_index = page_index || 1
    page_size = page_size || 10
    let _options = {
        where: {
            is_public: 1
        },
        attributes: {
            exclude: ['is_public', 'user_id', 'channel_id', 'source_id']
        },
        include: [{
            model: news.db.user,
            attributes: ['id', 'name', 'avatar']
        }, {
            model: news.db.channel,
            attributes: ['id', 'name', 'name_en']
        }, {
            model: news.db.source,
            attributes: ['id', 'name']
        }],
        offset: (page_index - 1) * page_size,
        limit: page_size,
        order: [['created_time', 'DESC']]
    }
    let result = await news.findAndCountAll(_options)
    return result
}
