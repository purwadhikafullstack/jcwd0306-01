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
      // define association here
      OrderProduct.belongsTo(models.Order, { foreignKey: 'orderId' });
      OrderProduct.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  OrderProduct.init(
    {
      orderId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
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
      paranoid: true,
    }
  );
  OrderProduct.associate = (models) => {
    // OrderProduct.belongsTo(models.Order, { foreignKey: 'orderId' });
    // OrderProduct.belongsTo(models.Product, { foreignKey: 'productId' });
  };
  return OrderProduct;
};
