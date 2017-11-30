'use strict'

const db = require('../models')

async function init() {
  await db.sequelize.sync({ force: true })
  require('../seeders')
}

init()
