const amazon = require('./amazon')
const kabum = require('./kabum')
const nodeCron = require('node-cron')

require('dotenv').config()
require('../db/database/index')

const runner = async () => {
    await amazon()
    await kabum()
}

// nodeCron.schedule("0 4 * * *", async () => {
//     await amazon()
//     await kabum()
// })

runner()