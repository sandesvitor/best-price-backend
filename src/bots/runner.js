const amazon = require('./amazon')
const kabum = require('./kabum')
const nodeCron = require('node-cron')

require('dotenv').config()
require('../db/database/index')

nodeCron.schedule("10 5 * * *", async () => {
    await amazon()
    await kabum()
})
