'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderProducts', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'price',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('OrderProducts', 'note');
  },
};
