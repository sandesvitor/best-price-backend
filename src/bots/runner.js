const amazon = require('./amazon')
const kabum = require('./kabum')
const nodeCron = require('node-cron')

require('dotenv').config()
require('../db/database/index')

const runBots = async () => {
    try {
        await amazon()
        await kabum()
    } catch (ex) {
        console.log(ex.message)
    }
}

nodeCron.schedule("*/10 */1 * * *", async () => {
    console.log("START OF WEB SCRAPPING at: ", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
    await runBots()
    console.log("END OF WEB SCRAPPING at: ", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
})

runBots()
