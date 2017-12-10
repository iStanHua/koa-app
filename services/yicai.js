const axios = require('../util/axios')
const cheerio = require('cheerio')
const pcUrl = 'http://www.yicai.com'
const mUrl = 'http://m.yicai.com'

/**
 * 新闻列表
 */
exports.news = async () => {
    let _url = pcUrl + '/news/'
    let result = await axios.http(_url)
    let $ = cheerio.load(result)
    let $news_List = $('#news_List')
    let _list = []
    $news_List.children('dl').each(function (index, elem) {
        let _obj = {}
        let $this = $(this)

        let $h3 = $this.find('h3')
        let _ids = $h3.children('a').attr('href').match(/(\d+)\.html/)
        _obj.id = _ids[_ids.length - 1]
        _obj.title = $h3.text()
        _obj.abstract = $this.find('p').text()

        let $h4 = $this.find('h4')
        if ($h4.children('div').length) {
            _obj.tips = $h4.children('div').text()
        }
        if ($h4.children('span').length) {
            _obj.author = $h4.children('span').text()
        }
        _obj.create_time = $h4.text().match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[0]

        let $dt = $this.children('dt')
        if (!$dt.hasClass('nopic')) {
            _obj.image = $dt.find('img').attr('data-original')
        }

        let $h5 = $this.find('h5')
        _obj.channel = {}
        _obj.channel.name = $h5.text()
        _obj.channel.en = $h5.children('a').attr('href').replace(_url, '').replace('/', '')
        _list.push(_obj)
    })
    return _list
}
/**
 * 新闻详情
 * @param {Number} news_id  新闻编号
 */
exports.newsDetail = async (news_id) => {
    let _url = pcUrl + '/news/' + news_id + '.html'
    let result = await axios.http(_url)
    let $ = cheerio.load(result)
    let $detail = $('.g-mn5 .m-txt')
    let _detail = {}
    _detail.id = news_id
    let $title = $detail.find('.m-title')
    _detail.title = $title.children('h1').text()
    _detail.content = $detail.find('.m-text').html()

    let $h2 = $title.children('h2')
    _detail.source = $h2.children('i').text()
    if ($h2.children('a').length) {
        _detail.channel = {}
        _detail.channel.name = $h2.children('a').text()
        _detail.channel.en = $h2.children('a').attr('href').replace(pcUrl + '/news/', '').replace('/', '')
    }
    if ($h2.children('span').eq(2).text()) {
        _detail.author = $h2.children('span').eq(2).text()
    }
    _detail.create_time = $h2.children('span').last().text()
    _detail.editor = $detail.children('h3').children('span').text()

    return _detail
}

/**
 * 数据列表
 */
exports.data = async () => {
    let _url = pcUrl + '/data/'
    let result = await axios.http(_url)
    let $ = cheerio.load(result)
    let $news_List = $('#news_List')
    let _list = []
    $news_List.children('dl').each(function (index, elem) {
        let _obj = {}
        let $this = $(this)

        let $h3 = $this.find('h3')
        let _ids = $h3.children('a').attr('href').match(/(\d+)\.html/)
        _obj.id = _ids[_ids.length - 1]
        _obj.title = $h3.text()
        _obj.abstract = $this.find('p').text()

        let $h4 = $this.find('h4')
        if ($h4.children('div').length) {
            _obj.tips = $h4.children('div').text()
        }
        if ($h4.children('span').length) {
            _obj.author = $h4.children('span').text()
        }
        _obj.create_time = $h4.text().match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[0]

        let $dt = $this.children('dt')
        if (!$dt.hasClass('nopic')) {
            _obj.image = $dt.find('img').attr('data-original')
        }

        let $h5 = $this.find('h5')
        _obj.channel = {}
        _obj.channel.name = $h5.text()
        _obj.channel.en = $h5.children('a').attr('href').replace(_url, '').replace('/', '')
        _list.push(_obj)
    })
    return _list
}
/**
 * 财富榜列表
 */
exports.richrank = async () => {
    let _url = pcUrl + '/data/richrank/'
    let result = await axios.http(_url)
    let $ = cheerio.load(result)
    let $richList = $('#richList')
    let _list = []
    $richList.find('tr').each(function (index, elem) {
        let _obj = {}
        let $this = $(this)
        let $td = $this.children('td')
        _obj.name = $td.eq(2).children('h3').text()
        _obj.avatar = $td.eq(1).children('img').attr('data-original')
        _obj.job = $td.eq(3).text()
        _obj.wealth = $td.eq(5).text()
        _obj.change = $td.eq(7).text()

        _list.push(_obj)
    })
    return _list
}
/**
 * 频道列表
 * @param {String} en  频道英文
 */
exports.channel = async (en) => {
    let _url = pcUrl + '/news/' + en + '/'
    let result = await axios.http(_url)
    let $ = cheerio.load(result)
    let $news_List = $('#news_List')
    let _channel = {}
    _channel.name = $news_List.prev('h1').text()
    _channel.en = en
    let _list = []
    $news_List.children('dl').each(function (index, elem) {
        let _obj = {}
        let $this = $(this)

        let $h3 = $this.find('h3')
        let _ids = $h3.children('a').attr('href').match(/(\d+)\.html/)
        _obj.id = _ids[_ids.length - 1]
        _obj.title = $h3.text()
        _obj.abstract = $this.find('p').text()
        _obj.create_time = $this.find('h4').text()
        let $dt = $this.children('dt')
        if (!$dt.hasClass('nopic')) {
            _obj.image = $dt.find('img').attr('data-original')
        }
        _list.push(_obj)
    })
    _channel.list = _list
    return _channel
}