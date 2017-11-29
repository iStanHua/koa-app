// Seed the data
const sequelize_fixtures = require('sequelize-fixtures');

var path = require('path');
var models = require('../models/');

sequelize_fixtures.loadFiles([
	'./seeders/authors.js',
	'./seeders/books.js'
], models).then(function () {
	console.log('Seed data loaded!');
});