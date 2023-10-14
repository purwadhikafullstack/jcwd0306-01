'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Cart.belongsTo(models.User, { foreignKey: 'userId' });
      // Cart.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  Cart.init(
    {
      userId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      isChecked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );
  // Cart.associate = (models) => {
  //   Cart.belongsTo(models.User, { foreignKey: 'userId' });
  //   Cart.belongsTo(models.Product, { foreignKey: 'productId' });
  // };
  return Cart;
};
