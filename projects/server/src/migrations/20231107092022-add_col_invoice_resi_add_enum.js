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
    await queryInterface.addColumn('Orders', 'invoiceId', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: 'id',
    });
    await queryInterface.addColumn('Orders', 'shippingReceipt', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      after: 'paymentProof',
    });
    await queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.ENUM(
        'unpaid',
        'verifying',
        'processed',
        'shipped',
        'received',
        'cancelled',
        'rejected'
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Orders', 'shippingReceipt');
    await queryInterface.removeColumn('Orders', 'invoiceId');
    await queryInterface.sequelize.query('Orders', 'status', {
      type: Sequelize.ENUM(
        'unpaid',
        'verifying',
        'processed',
        'shipped',
        'received',
        'cancelled'
      ),
    });
  },
};
