const express = require('express')
const routes = require('./routes')

require('dotenv').config()
require('./db/database/index')
const app = express()

app.use(express.json())
app.use(routes)

app.listen(process.env.PORT || 5000)