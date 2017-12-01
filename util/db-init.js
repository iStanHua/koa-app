'use strict'

const db = require('../models')

async function init() {
  await db.sequelize.sync({ force: true }) // 这将先丢弃表，然后重新创建它
  require('../seeders')
}

init()
