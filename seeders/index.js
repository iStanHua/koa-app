// Seed the data
const sequelize_fixtures = require('sequelize-fixtures')

const path = require('path')
const models = require('../models/')

sequelize_fixtures.loadFiles([
	'./seeders/user.js'
], models).then(function () {
	console.log('Seed data loaded!')
});