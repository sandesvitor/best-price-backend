const Product = require('../models/Product')

module.exports = {

    async index(req, res) {
        try {
            console.log('Trying to GET LIST of Products!')
            const products = await Product.findAll()

            return res.status(200).json(products)

        } catch (ex) {
            console.log('Error: ', ex.message)
            return res.status(500)
        }
    },

    async show(req, res) {
        try {
            const id = req.params.id
            console.log(id)

            const product = await Product.findByPk(id)

            return res.status(200).json(product)

        } catch (ex) {
            console.log('Error: ', ex.message)
            return res.status(500)
        }
    }
}