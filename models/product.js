'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, {as: 'buyer', foreignKey: 'BuyerId'})
      Product.belongsTo(models.User, {as: 'seller', foreignKey: 'SellerId'})
      Product.belongsTo(models.Category)
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    BuyerId: DataTypes.INTEGER,
    SellerId: DataTypes.INTEGER,
    CategoryId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};