'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'description', {
      type: Sequelize.TEXT('long'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
