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
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  Cart.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isChecked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );
  Cart.removeAttribute('id');
  return Cart;
};
