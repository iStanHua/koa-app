'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require('../config/mysql')[env]
const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  protocol: config.dialect,
  port: config.port,
  underscored: true,
  timezone: config.timezone,
  dialectOptions: {
    ssl: config.ssl
  },
  define: {
    // 不添加时间戳属性 (updatedAt, createdAt)
    timestamps: true,
    createdAt: 'created_time',
    updatedAt: 'updated_time',
    // deletedAt: 'deleted_time',
    // 不删除数据库条目，但将新添加的属性deletedAt设置为当前日期（删除完成时）。 
    // paranoid 只有在启用时间戳时才能工作
    // paranoid: true,
    // 不使用驼峰样式自动添加属性，而是下划线样式，因此updatedAt将变为updated_at
    underscored: true,
    // // 禁用修改表名; 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数。 如果你不想这样，请设置以下内容
    // freezeTableName: true
  }
})

sequelize.authenticate()
  .then(() => {
    console.log('连接已成功建立.')
  })
  .catch((err) => {
    console.log('无法连接到数据库:', err)
  })

//Load all the models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach((file) => {
    let model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
console.log(db)

//Export the db Object
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db