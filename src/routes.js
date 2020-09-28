const express = require('express')
const routes = express.Router()

const ProductController = require('./db/controllers/ProductController')

routes.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

routes.get('/products', ProductController.index)

module.exports = routes