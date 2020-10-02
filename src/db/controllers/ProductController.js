const Product = require('../models/Product')
const { Op } = require('sequelize')

module.exports = {

    async index(req, res) {
        try {
            console.log('Trying to GET LIST of Products!')
            const manufacturers = req.query.mn
            const maxPrice = req.query.mp
            const retailers = req.query.rt
            const paginationLimit = req.query.pl
            const orderByPrice = req.query.ob_d ? 'ASC' : 'DESC'
            // const rating = req.query.sr

            const products = await Product.findAll({
                limit: paginationLimit,
                order: [
                    ['price', `${orderByPrice}`]
                ],
                where: {
                    manufacturer: {
                        [Op.and]: [manufacturers]
                    },
                    price: {
                        [Op.lte]: maxPrice
                    },
                    retailer: {
                        [Op.and]: [retailers]
                    }
                }

            })
            console.log('\nQuery data from req.query:')
            console.log(req.query)

            return res.status(200).json(products)

        } catch (ex) {
            console.log('Error: ', ex.message)
            return res.status(500)
        }
    },

    async show(req, res) {
        try {
            console.log('Trying to GET max Price Value in PRODUCTS TABLE')

            const maxPrice = await Product.max('price')

            return res.status(200).json(maxPrice)

        } catch (ex) {
            console.log('Error: ', ex.message)
            return res.status(500)
        }
    }
}