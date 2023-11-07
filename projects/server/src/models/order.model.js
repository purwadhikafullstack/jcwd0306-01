'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // Product < OrderProduct > Order
      // ======================================================
      models.Order.belongsToMany(models.Product, {
        through: models.OrderProduct,
        foreignKey: { name: 'orderId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.Order.hasMany(models.OrderProduct, {
        foreignKey: { name: 'orderId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      models.Order.belongsTo(models.User, {
        foreignKey: { name: 'userId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Order.belongsTo(models.User, {
        foreignKey: { name: 'adminId', allowNull: true },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Order.belongsTo(models.UserAddress, {
        foreignKey: { name: 'userAddressId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Order.belongsTo(models.Warehouse, {
        foreignKey: { name: 'warehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Order.hasMany(models.StockMutation, {
        foreignKey: { name: 'orderId', allowNull: true },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Order.init(
    {
      status: {
        type: DataTypes.ENUM(
          'unpaid',
          'verifying',
          'processed',
          'shipped',
          'received',
          'cancelled',
          'rejected'
        ),
        allowNull: false,
      },
      invoiceId: { type: DataTypes.STRING, allowNull: false, unique: true },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
      shippingMethod: { type: DataTypes.STRING, allowNull: false },
      shippingPrice: { type: DataTypes.INTEGER, allowNull: false },
      shippingReceipt: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      paymentProof: { type: DataTypes.BLOB('long'), allowNull: true },
      promoCode: { type: DataTypes.STRING, allowNull: true },
      isReadByAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isReadByUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      // paranoid: true,
    }
  );
  return Order;
};
