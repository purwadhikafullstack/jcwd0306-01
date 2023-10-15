'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StockMutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.StockMutation.belongsTo(models.Product, {
        foreignKey: { name: 'productId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.StockMutation.belongsTo(models.Warehouse, {
        foreignKey: { name: 'fromWarehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.StockMutation.belongsTo(models.Warehouse, {
        foreignKey: { name: 'toWarehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // models.StockMutation.belongsTo(models.User, {
      //   foreignKey: { name: 'requestAdminId' },
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      // models.StockMutation.belongsTo(models.User, {
      //   foreignKey: { name: 'approveAdminId' },
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      // models.StockMutation.belongsTo(models.Order, {
      //   foreignKey: { name: 'orderId' },
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      models.StockMutation.hasMany(models.StockHistory, {
        foreignKey: { name: 'stockMutationId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  StockMutation.init(
    {
      status: {
        type: DataTypes.ENUM(
          'rejected',
          'requested',
          'processed',
          'shipped',
          'received'
        ),
        allowNull: false,
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.ENUM('request', 'order'), allowNull: false },
    },
    {
      sequelize,
      modelName: 'StockMutation',
    }
  );
  return StockMutation;
};
