const path = require('path')
// 日志根目录
const baseLogPath = path.resolve(__dirname, '../logs')
// 错误日志目录
const errorPath = path.join(baseLogPath, 'error')
// 响应日志目录
const responsePath = path.join(baseLogPath, 'response')
// 错误日志输出完整路径
const errorLogPath = path.join(errorPath, 'error')
// 响应日志输出完整路径
const responseLogPath = path.join(responsePath, 'response')

module.exports = {
  basepath: baseLogPath,
  appenders: [
    {
      'category': 'errorLogger',        // logger名称
      'type': 'dateFile',               // 日志类型
      'filename': errorLogPath,         // 日志输出位置
      'alwaysIncludePattern': true,     // 是否总是有后缀名
      'pattern': '-yyyy-MM-dd-hh.log',  // 后缀，每小时创建一个新的日志文件
      'path': errorPath
    },
    {
      'category': 'resLogger',
      'type': 'dateFile',
      'filename': responseLogPath,
      'alwaysIncludePattern': true,
      'pattern': '-yyyy-MM-dd-hh.log',
      'path': responsePath
    }
  ],
  levels: {
    'errorLogger': 'ERROR',
    'resLogger': 'ALL'
  }
}
