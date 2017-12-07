// Seed the data
const fs = require('fs')
const path = require('path')
const sequelize_fixtures = require('sequelize-fixtures')

const models = require('../models/')

const basename = path.basename(module.filename)

let _loadFiles = []

//Load all the models
fs.readdirSync(__dirname).filter((file) => {
	return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach((file) => {
	_loadFiles.push('./seeders/' + file)
})

sequelize_fixtures.loadFiles(_loadFiles, models).then(() => {
	console.log('Seed data loaded!')
	process.exit()
}).catch((err) => {
	console.log(err)
	process.exit()
})