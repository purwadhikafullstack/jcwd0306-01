'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WarehouseProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // Product < WarehouseProduct > Warehouse
      // ======================================================
      models.WarehouseProduct.belongsTo(models.Product, {
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.WarehouseProduct.belongsTo(models.Warehouse, {
        foreignKey: { name: 'warehouseId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================
    }
  }
  WarehouseProduct.init(
    {
      stock: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'WarehouseProduct',
      paranoid: true,
    }
  );
  WarehouseProduct.removeAttribute('id');
  return WarehouseProduct;
};
