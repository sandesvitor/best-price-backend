const express = require('express')
const routes = express.Router()

const ProductController = require('./db/controllers/ProductController')

routes.get('/', (req, res) => {
    res.send('<h1>Server Running!</h1>')
})

routes.get('/products/', ProductController.index)
routes.get('/products/:id/', ProductController.show)

module.exports = routes