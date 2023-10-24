'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('UserAddresses', 'addressName', {
      type: Sequelize.STRING,
      after: 'userId',
    });
    await queryInterface.addColumn('UserAddresses', 'receiverName', {
      type: Sequelize.STRING,
      after: 'userId',
    });
    await queryInterface.addColumn('UserAddresses', 'receiverPhone', {
      type: Sequelize.STRING,
      after: 'userId',
    });
    await queryInterface.addColumn('UserAddresses', 'postalCode', {
      type: Sequelize.INTEGER,
      after: 'cityId',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserAddresses', 'addressName');
    await queryInterface.removeColumn('UserAddresses', 'receiverName');
    await queryInterface.removeColumn('UserAddresses', 'receiverPhone');
    await queryInterface.removeColumn('UserAddresses', 'postalCode');
  },
};
