'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // Product < WarehouseProduct > Warehouse
      // ======================================================
      models.Warehouse.belongsToMany(models.Product, {
        through: models.WarehouseProduct,
        foreignKey: { name: 'warehouseId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.Warehouse.hasMany(models.WarehouseProduct, {
        foreignKey: { name: 'warehouseId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      // User < WarehouseUser > Warehouse
      // ======================================================
      models.Warehouse.hasMany(models.WarehouseUser, {
        foreignKey: { name: 'warehouseId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      // Warehouse < StockMutation
      // ======================================================
      models.Warehouse.hasMany(models.StockMutation, {
        foreignKey: { name: 'fromWarehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        as: 'fromWarehouse',
      });
      models.Warehouse.hasMany(models.StockMutation, {
        foreignKey: { name: 'toWarehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        as: 'toWarehouse',
      });
      // ======================================================

      // ======================================================
      models.Warehouse.hasOne(models.WarehouseAddress, {
        foreignKey: { name: 'warehouseId', primaryKey: true, allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Warehouse.hasMany(models.StockHistory, {
        foreignKey: { name: 'warehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Warehouse.hasMany(models.Order, {
        foreignKey: { name: 'warehouseId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Warehouse.init(
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: 'Warehouse',
      paranoid: true,
    }
  );
  return Warehouse;
};
