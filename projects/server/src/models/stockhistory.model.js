'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.StockHistory.belongsTo(models.Warehouse, {
        foreignKey: { name: 'warehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.StockHistory.belongsTo(models.Product, {
        foreignKey: { name: 'productId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // models.StockHistory.belongsTo(models.User, {
      //   foreignKey: { name: 'adminId', allowNull: false },
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      models.StockHistory.belongsTo(models.StockMutation, {
        foreignKey: { name: 'stockMutationId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  StockHistory.init(
    {
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.ENUM('manual', 'stock-mutation'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'StockHistory',
    }
  );
  return StockHistory;
};
