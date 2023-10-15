'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WarehouseProducts', {
      warehouseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Warehouses', key: 'id' },
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
      stock: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WarehouseProducts');
  },
};
