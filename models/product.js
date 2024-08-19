'use strict';
const {
  Model,
  Op
} = require('sequelize');
const { converRupiah } = require('../helpers/convert');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, { as: 'buyer', foreignKey: 'BuyerId', onDelete: 'CASCADE' });
      Product.belongsTo(models.User, { as: 'seller', foreignKey: 'SellerId', onDelete: 'CASCADE' });
      Product.belongsTo(models.Category, { foreignKey: 'CategoryId', onDelete: 'CASCADE' });
    }

    static searchProduct(search) {
        let options = {
        include: 'Category',
      };
      if (search) {
        options.where = {
          name: {
            [Op.iLike]: `%${search}%`
          }
        };
      }
      return Product.findAll(options);
    }

    get convert() {
      return converRupiah(this.price)
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Product Name is required',
          },
          notEmpty: {
            msg: 'Product Name is required',
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Price is required',
          },
          notEmpty: {
            msg: 'Price is required',
          },
          max: {
            args: 2147483647,
            msg: 'Price is too high'
          },
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Image is required',
          },
          notEmpty: {
            msg: 'Image is required',
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Description is required',
          },
          notEmpty: {
            msg: 'Description is required',
          },
        },
      },
      BuyerId: DataTypes.INTEGER,
      SellerId: DataTypes.INTEGER,
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Category is required',
          },
          notEmpty: {
            msg: 'Category is required',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );
  return Product;
};  