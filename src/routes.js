const express = require('express')
const routes = express.Router()

const ProductController = require('./db/controllers/ProductController')

routes.get('/products/', ProductController.index)
routes.get('/products/max/', ProductController.getHigherPrice)

module.exports = routes