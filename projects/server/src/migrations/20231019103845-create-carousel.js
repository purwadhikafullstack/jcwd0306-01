'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carousels', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      image: { type: Sequelize.BLOB('long'), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carousels');
  },
};
