const Product = require('../models/Product')
const { Op } = require('sequelize')

module.exports = {

    async index(req, res) {
        try {
            console.log('Trying to GET LIST of Products!')
            const manufacturers = req.query.mn
            const maxPrice = parseFloat(req.query.mp)
            const retailers = req.query.rt
            const paginationLimit = req.query.pl
            const orderByPrice = req.query.ob_d
            // const rating = req.query.sr

            const queryHash = {
                limit: paginationLimit,
                order: [['price', orderByPrice === '1' ? 'ASC' : 'DESC']],
                where: {

                    manufacturer: { [Op.and]: [manufacturers] },
                    price: { [Op.lte]: maxPrice },
                    retailer: { [Op.and]: [retailers] }
                }
            }

            const products = await Product.findAll(queryHash)
            console.info('\nQuery data from req.query:')
            console.info(req.query)
            console.info('\nQuery Parsed from Hash:')
            console.info(queryHash)

            return res.status(200).json(products)

        } catch (ex) {
            console.log('Error: ', ex.message)
            return res.status(500)
        }
    },

    async getHigherPrice(req, res) {
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