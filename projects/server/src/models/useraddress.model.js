'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.UserAddress.belongsTo(models.User, {
        foreignKey: { name: 'userId', primaryKey: true, allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.UserAddress.belongsTo(models.Province, {
        foreignKey: { name: 'provinceId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.UserAddress.belongsTo(models.City, {
        foreignKey: { name: 'provinceId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.UserAddress.hasMany(models.Order, {
        foreignKey: { name: 'userAddressId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  UserAddress.init(
    {
      country: { type: DataTypes.STRING, allowNull: false },
      district: { type: DataTypes.STRING, allowNull: false },
      village: { type: DataTypes.STRING, allowNull: false },
      detail: { type: DataTypes.TEXT, allowNull: false },
      longitude: { type: DataTypes.DOUBLE, allowNull: false },
      latitude: { type: DataTypes.DOUBLE, allowNull: false },
      isDefault: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      sequelize,
      modelName: 'UserAddress',
    }
  );
  return UserAddress;
};
