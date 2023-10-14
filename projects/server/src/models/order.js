'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'userid' });
      Order.belongsTo(models.UserAddress, { foreignKey: 'userAddressId' });
      Order.belongsTo(models.User, { foreignKey: 'adminId', as: 'adminid' });
      Order.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
      Order.hasMany(models.OrderProduct, { foreignKey: 'orderId' });
    }
  }
  Order.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      status: DataTypes.ENUM([
        'Waiting for payment',
        'Payment verification',
        'Processed',
        'Shipped',
        'Received',
        'Cancelled',
      ]),
      userAddressId: { type: DataTypes.INTEGER, allowNull: false },
      warehouseId: DataTypes.INTEGER,
      adminId: DataTypes.INTEGER,
      total: { type: DataTypes.INTEGER, validate: { min: 0 } },
      shippingMethod: DataTypes.STRING,
      shippingPrice: DataTypes.INTEGER,
      paymentProof: DataTypes.BLOB,
      promoCode: DataTypes.STRING,
      isReadByAdmin: { type: DataTypes.BOOLEAN, defaultValue: true },
      isReadByUser: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      paranoid: true,
      sequelize,
      modelName: 'Order',
    }
  );

  Order.associate = (models) => {
    // Order.belongsTo(models.User, { foreignKey: 'userId', as: 'userid' });
    // Order.belongsTo(models.UserAddress, { foreignKey: 'userAddressId' });
    // Order.belongsTo(models.User, { foreignKey: 'adminId', as: 'adminid' });
    // Order.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
    // Order.hasMany(models.OrderProduct, { foreignKey: 'orderId' });
  };
  return Order;
};
