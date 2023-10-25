'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'isWarehouseAdmin');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'isWarehouseAdmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
};
