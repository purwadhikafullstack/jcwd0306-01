'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockMutations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      fromWarehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Warehouses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      toWarehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Warehouses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM(
          'rejected',
          'requested',
          'processed',
          'shipped',
          'received'
        ),
        allowNull: false,
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.ENUM('request', 'order'), allowNull: false },
      requestAdminId: {
        type: Sequelize.INTEGER,
        // references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      approveAdminId: {
        type: Sequelize.INTEGER,
        // references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      orderId: {
        type: Sequelize.INTEGER,
        // references: { model: 'Orders', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StockMutations');
  },
};
