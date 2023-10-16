'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM(
          'unpaid',
          'verifying',
          'processed',
          'shipped',
          'received',
          'cancelled'
        ),
        allowNull: false,
      },
      userAddressId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'UserAddresses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Warehouses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
      shippingMethod: { type: Sequelize.STRING, allowNull: false },
      shippingPrice: { type: Sequelize.INTEGER, allowNull: false },
      paymentProof: { type: Sequelize.BLOB('long'), allowNull: true },
      promoCode: { type: Sequelize.STRING, allowNull: true },
      isReadByAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isReadByUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
