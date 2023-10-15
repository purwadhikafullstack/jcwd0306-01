'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderProducts', {
      orderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        // references: { model: 'Orders', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderProducts');
  },
};
