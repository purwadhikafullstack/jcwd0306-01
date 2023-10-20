'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('UserAddresses', `addressName`, {
      type: Sequelize.STRING,
      after: 'userId',
    });
    await queryInterface.addColumn('UserAddresses', `receiverName`, {
      type: Sequelize.STRING,
      after: 'userId',
    });
    await queryInterface.addColumn('UserAddresses', `receiverPhone`, {
      type: Sequelize.STRING,
      after: 'userId',
    });
    await queryInterface.addColumn('UserAddresses', `postalCode`, {
      type: Sequelize.INTEGER,
      after: 'cityId',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('UserAddresses', `addressName`);
    queryInterface.removeColumn('UserAddresses', `receiverName`);
    queryInterface.removeColumn('UserAddresses', `receiverPhone`);
    queryInterface.removeColumn('UserAddresses', `postalCode`);
  },
};
