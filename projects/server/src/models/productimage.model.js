'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ProductImage.belongsTo(models.Product, {
        foreignKey: { name: 'productId', allowNull: false },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  ProductImage.init(
    {
      image: { type: DataTypes.BLOB('long'), allowNull: false },
    },
    {
      sequelize,
      modelName: 'ProductImage',
    }
  );
  return ProductImage;
};
