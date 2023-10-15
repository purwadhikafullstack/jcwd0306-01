'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockHistories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Warehouses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      type: {
        type: Sequelize.ENUM('manual', 'stock-mutation'),
        allowNull: false,
      },
      adminId: {
        type: Sequelize.INTEGER,
        // references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      stockMutationId: {
        type: Sequelize.INTEGER,
        references: { model: 'StockMutations', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StockHistories');
  },
};
