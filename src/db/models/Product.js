const { DataTypes, Model } = require('sequelize')


class Product extends Model {
    static init(connection) {
        super.init({
            retailer: DataTypes.STRING,
            code: DataTypes.STRING,
            name: DataTypes.STRING,
            manufacturer: DataTypes.STRING,
            price: DataTypes.FLOAT,
            link: DataTypes.STRING,
            imageUrl: DataTypes.STRING

        }, {
            sequelize: connection,
            tableName: 'products'
        })

    }
}

module.exports = Product