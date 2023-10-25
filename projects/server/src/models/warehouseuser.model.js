'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WarehouseUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // User < WarehouseUser > Warehouse
      // ======================================================
      models.WarehouseUser.belongsTo(models.Warehouse, {
        foreignKey: { name: 'warehouseId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.WarehouseUser.belongsTo(models.User, {
        foreignKey: {
          name: 'warehouseAdminId',
          primaryKey: true,
          unique: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================
    }
  }
  WarehouseUser.init(
    {},
    {
      sequelize,
      modelName: 'WarehouseUser',
    }
  );
  WarehouseUser.removeAttribute('id');
  return WarehouseUser;
};
