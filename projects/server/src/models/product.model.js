'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // Product < Cart > User
      // ======================================================
      models.Product.belongsToMany(models.User, {
        through: models.Cart,
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.Product.hasMany(models.Cart, {
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      // Product < WarehouseProduct > Warehouse
      // ======================================================
      models.Product.belongsToMany(models.Warehouse, {
        through: models.WarehouseProduct,
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.Product.hasMany(models.WarehouseProduct, {
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      // Product < OrderProduct > Order
      // ======================================================
      models.Product.belongsToMany(models.Order, {
        through: models.OrderProduct,
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.Product.hasMany(models.OrderProduct, {
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================

      // ======================================================
      models.Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Product.hasMany(models.ProductImage, {
        foreignKey: { name: 'productId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Product.hasMany(models.StockMutation, {
        foreignKey: { name: 'productId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      models.Product.hasMany(models.StockHistory, {
        foreignKey: { name: 'productId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Product.init(
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      weight: { type: DataTypes.FLOAT, allowNull: false },
      discount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );
  return Product;
};
