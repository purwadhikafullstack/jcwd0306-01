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
      // define association here
      models.WarehouseAddress.belongsTo(models.Warehouse, {
        foreignKey: { name: 'warehouseId', primaryKey: true, allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  WarehouseAddress.init(
    {
      country: { type: DataTypes.STRING, allowNull: false },
      province: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      district: { type: DataTypes.STRING, allowNull: false },
      village: { type: DataTypes.STRING, allowNull: false },
      detail: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.FLOAT, allowNull: false },
      latitude: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'WarehouseAddress',
    }
  );
  WarehouseAddress.removeAttribute('id');
  return WarehouseAddress;
};
