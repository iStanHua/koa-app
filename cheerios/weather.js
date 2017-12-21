const axios = require('../util/axios')
const cheerio = require('cheerio')
const baseUrl = 'http://weather1.sina.cn'

/**
 * 查询天气
 */
exports.query = async (code) => {
    let _url = baseUrl + '/?cf=c&vt=4&cf=c'
    if (code) {
        _url = baseUrl + `/?code=${code}&vt=4&cf=c`
    }
    let html = await axios.http(_url)
    let $ = cheerio.load(html)
    let $cont = $('.inx_w_cont .inx_w_cont_dl')
    let result = {}

    result.cityName = $cont.find('.inx_w_city_c').text()

    result.weather = {}
    let _mare = $cont.find('.inx_w_r_mare').text().trim().split('\n')
    result.weather.value = _mare.length ? _mare[0] : ''
    result.weather.img = $cont.find('.inx_w_pic').children('img').attr('src')

    // 风
    result.wind = {}
    let _wind = (_mare.length ? _mare[1].trim() : ' ').split(' ')
    result.wind.direction = _wind.length ? _wind[0] : ''
    result.wind.power = _wind.length ? _wind[1].replace('级', '') : ''

    // 空气质量
    result.aqi = $cont.find('.inx_link_tips').find('b').text()

    // 温度
    result.tmp = $cont.find('.inx_w_r_num').children('strong').text()

    let $card_wrap = $('.card_wrap')

    // 当天天气情况
    result.list = []
    let $scroller = $('#scroller')
    $scroller.children('.weather_list_items_t').each((index, ele) => {
        let $p = $(ele).children('p')
        let _obj = {}
        _obj.time = $p.eq(0).text()
        _obj.img = $p.eq(1).children('img').attr('src')
        _obj.tmp = $p.eq(2).text()
        result.list.push(_obj)
    })

    // 预报
    result.forecast = []
    let $datemate = $card_wrap.find('.weather_datemate')
    $datemate.children('li').each((index, ele) => {
        let $p = $(ele).children('p')
        let _obj = {}
        _obj.date = $p.eq(0).children('span').text()
        _obj.weather = {}
        _obj.weather.h = $p.eq(1).children('span').eq(0).text()
        _obj.weather.l = $p.eq(1).children('span').eq(1).text()
        _obj.wind = {}
        _obj.wind.h = $p.eq(2).children('span').eq(0).text()
        _obj.wind.l = $p.eq(2).children('span').eq(1).text()
        _obj.tmp = {}
        _obj.tmp.h = $p.eq(3).children('span').eq(0).text().replace('℃', '')
        _obj.tmp.l = $p.eq(3).children('span').eq(1).text().replace('℃', '')
        result.forecast.push(_obj)
    })

    let $living = $card_wrap.find('.living_items')

    // 生活指数
    result.suggestion = []
    $living.children('li').each((index, ele) => {
        let $p = $(ele).find('p')
        if (index == 0) {
            // 日出时间
            result.sunrise = $p.eq(0).text().replace('日出', '').trim()
            // 日落时间
            result.sunset = $p.eq(1).text().replace('日落', '').trim()
        }
        else {
            let _obj = {}
            _obj.name = $p.eq(0).text()
            _obj.value = $p.eq(1).text()
            result.suggestion.push(_obj)
        }
    })

    result.update = $cont.find('.inx_w_r_time').text().replace('更新', '').trim().split(' ')[1]

    return result
}