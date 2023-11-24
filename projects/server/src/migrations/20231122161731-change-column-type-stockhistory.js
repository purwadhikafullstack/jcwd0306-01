'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockHistories', 'type', {
      type: Sequelize.ENUM('manual', 'stock-mutation', 'order'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockHistories', 'type', {
      type: Sequelize.ENUM('manual', 'stock-mutation'),
      allowNull: false,
    });
  },
};
