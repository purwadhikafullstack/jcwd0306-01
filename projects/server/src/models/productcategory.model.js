'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ======================================================
      // Product < ProductCategory > Category
      // ======================================================
      models.ProductCategory.belongsTo(models.Product, {
        foreignKey: { name: 'productId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.ProductCategory.belongsTo(models.Category, {
        foreignKey: { name: 'categoryId', primaryKey: true, unique: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // ======================================================
    }
  }
  ProductCategory.init(
    {},
    {
      sequelize,
      modelName: 'ProductCategory',
      paranoid: true,
    }
  );
  ProductCategory.removeAttribute('id');
  return ProductCategory;
};
