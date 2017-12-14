let nodeSchedule = require('node-schedule')
let news = require('../controllers/news')

//每小时的30分钟执行
let rule = new nodeSchedule.RecurrenceRule()
rule.minute = 20

let schedule = {}

schedule.start = () => {
	//开始任务的时候先更新一次
	news.batchAdd()
	//注册定时任务
	schedule.job = nodeSchedule.scheduleJob(rule, () => {
		news.batchAdd()
	});
}

module.exports = schedule