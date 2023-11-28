'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('StockHistories', 'orderId', {
      after: 'stockMutationId',
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Orders', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('StockHistories', 'orderId');
  },
};
