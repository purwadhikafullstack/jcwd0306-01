'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' },
      },
      status: {
        type: Sequelize.ENUM([
          'Waiting for payment',
          'Payment verification',
          'Processed',
          'Shipped',
          'Received',
          'Cancelled',
        ]),
      },
      userAddressId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'UserAddress', key: 'id' },
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        references: { model: 'Warehouse', key: 'id' },
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
      },
      total: {
        type: Sequelize.INTEGER,
      },
      shippingMethod: {
        type: Sequelize.STRING,
      },
      shippingPrice: {
        type: Sequelize.INTEGER,
      },
      paymentProof: {
        type: Sequelize.BLOB,
      },
      promoCode: {
        type: Sequelize.STRING,
      },
      isReadByAdmin: {
        type: Sequelize.BOOLEAN,
      },
      isReadByUser: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
