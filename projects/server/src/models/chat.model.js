'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chat.belongsTo(models.User, {
        as: 'Sender',
        foreignKey: { name: 'senderId', primaryKey: true, unique: false },
      });
      models.Chat.belongsTo(models.User, {
        as: 'Receiver',
        foreignKey: { name: 'receiverId', primaryKey: true, unique: false },
      });
      models.Chat.belongsTo(models.Order, {
        foreignKey: { name: 'orderId', primaryKey: true, unique: false },
      });
      models.Chat.belongsTo(models.Warehouse, {
        foreignKey: { name: 'warehouseId', primaryKey: true, unique: false },
      });
    }
  }
  Chat.init(
    {
      message: { type: DataTypes.STRING, allowNull: false },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      imageURL: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Chat',
    }
  );
  return Chat;
};
