const amazon = require('./amazon')
const kabum = require('./kabum')

require('dotenv').config()
require('../db/database/index')

const runBots = async () => {
    await amazon()
    await kabum()
}

runBots()