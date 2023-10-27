'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // Product < Cart > User
      // ======================================================
      models.User.belongsToMany(models.Product, {
        through: models.Cart,
        foreignKey: { name: 'userId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.User.hasMany(models.Cart, {
        foreignKey: { name: 'userId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      // User < WarehouseUser > Warehouse
      // ======================================================
      models.User.belongsToMany(models.Warehouse, {
        through: models.WarehouseUser,
        foreignKey: {
          name: 'warehouseAdminId',
          primaryKey: true,
          unique: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.User.hasMany(models.WarehouseUser, {
        foreignKey: {
          name: 'warehouseAdminId',
          primaryKey: true,
          unique: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      models.User.hasMany(models.UserAddress, {
        foreignKey: { name: 'userId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.User.hasMany(models.StockHistory, {
        foreignKey: { name: 'adminId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.User.hasMany(models.StockMutation, {
        foreignKey: { name: 'requestAdminId' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.User.hasMany(models.StockMutation, {
        foreignKey: { name: 'approveAdminId' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.User.hasMany(models.Order, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'UserOrder',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.User.hasMany(models.Order, {
        foreignKey: { name: 'adminId', allowNull: true },
        as: 'ApprovedOrder',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  User.init(
    {
      uuidGoogle: { type: DataTypes.UUID, allowNull: true, unique: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.BLOB('long'), allowNull: true },
      isCustomer: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
