const Product = require('../models/Product')

module.exports = {

    async index(data) {
        try {
            console.log('Trying to GET LIST of Products!')
        } catch (ex) {
            console.log('Error: ', ex.message)
        }
    },
    async store(data) {
        try {
            //check for same product!
            console.log('Trying to STORE new Product:')
        } catch (ex) {
            console.log('Error: ', ex.message)
        }
    },



}