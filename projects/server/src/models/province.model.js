'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Province.hasMany(models.City, {
        foreignKey: { name: 'provinceId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Province.hasMany(models.UserAddress, {
        foreignKey: { name: 'provinceId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Province.hasMany(models.WarehouseAddress, {
        foreignKey: { name: 'provinceId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Province.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Province',
    }
  );
  return Province;
};
