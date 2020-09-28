const express = require('express')
const routes = require('./routes')

require('dotenv').config()
require('./db/database/index')
const PORT = process.env.PORT || 5000
const app = express()

const hello = require('./bots/helloWorld')

app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
    console.log('Server listenning on Port [%s]', PORT)
})