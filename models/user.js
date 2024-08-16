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
       User.hasOne(models.Profile, { onDelete: 'CASCADE', foreignKey: 'UserId' });
      User.hasMany(models.Product, { as: 'ProductSeller', foreignKey: 'SellerId', onDelete: 'CASCADE' });
      User.hasMany(models.Product, { as: 'ProductBuyer', foreignKey: 'BuyerId', onDelete: 'CASCADE' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username is required"
        },
        notEmpty: {
          msg: "Username is required"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role is required"
        },
        notEmpty: {
          msg: "Role is required"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required"
        },
        notEmpty: {
          msg: "Password is required"
        }
      }
    }
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