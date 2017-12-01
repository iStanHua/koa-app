'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]
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
    timestamps: false
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

//Export the db Object
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db