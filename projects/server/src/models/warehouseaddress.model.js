'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WarehouseAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.WarehouseAddress.belongsTo(models.Warehouse, {
        foreignKey: { name: 'warehouseId', primaryKey: true, allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.WarehouseAddress.belongsTo(models.Province, {
        foreignKey: { name: 'provinceId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.WarehouseAddress.belongsTo(models.City, {
        foreignKey: { name: 'cityId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  WarehouseAddress.init(
    {
      country: { type: DataTypes.STRING, allowNull: false },
      district: { type: DataTypes.STRING, allowNull: false },
      village: { type: DataTypes.STRING, allowNull: false },
      detail: { type: DataTypes.TEXT, allowNull: false },
      longitude: { type: DataTypes.DOUBLE, allowNull: false },
      latitude: { type: DataTypes.DOUBLE, allowNull: false },
    },
    {
      sequelize,
      modelName: 'WarehouseAddress',
      paranoid: true,
    }
  );
  WarehouseAddress.removeAttribute('id');
  return WarehouseAddress;
};
