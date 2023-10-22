'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // Product < OrderProduct > Order
      // ======================================================
      models.OrderProduct.belongsTo(models.Product, {
        through: models.OrderProduct,
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.OrderProduct.belongsTo(models.Order, {
        foreignKey: { name: 'orderId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================
    }
  }
  OrderProduct.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
    },
    {
      sequelize,
      modelName: 'OrderProduct',
      // paranoid: true,
    }
  );
  OrderProduct.removeAttribute('id');
  return OrderProduct;
};
