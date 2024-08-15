'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Product, {as: 'ProductSeller', foreignKey: 'SellerId'})
      User.hasMany(models.Product, {as: 'ProductBuyer', foreignKey: 'BuyerId'})
    }
  }
  User.init({
    username: DataTypes.STRING,
    role: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(8)
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash
  })
  return User;
};