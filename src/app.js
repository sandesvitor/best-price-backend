const express = require('express')
const routes = require('./routes')
const nodeCron = require('node-cron')

require('dotenv').config()
require('./db/database/index')
const PORT = process.env.PORT || 5000
const app = express()

const hello = require('./bots/helloWorld')

app.use(express.json())
app.use(routes)

// nodeCron.schedule("10 * * * * *", async () => {
//     await hello('antes').then(console.log).catch(console.log)
//     await hello('depois').then(console.log).catch(console.log)
// })

app.listen(PORT, () => {
    console.log('Server listenning on Port [%s]', PORT)
})