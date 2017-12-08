'use strict'

const db = require('../models')

async function init() {
  // 这将先丢弃表，然后重新创建它
  await db.sequelize.sync({ force: true })
  require('../seeders')
}

init()