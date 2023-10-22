'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAddresses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      country: { type: Sequelize.STRING, allowNull: false },
      provinceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Provinces', key: 'id' },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Cities', key: 'id' },
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      },
      district: { type: Sequelize.STRING, allowNull: false },
      village: { type: Sequelize.STRING, allowNull: false },
      detail: { type: Sequelize.TEXT, allowNull: false },
      longitude: { type: Sequelize.DOUBLE, allowNull: false },
      latitude: { type: Sequelize.DOUBLE, allowNull: false },
      isDefault: { type: Sequelize.BOOLEAN, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAddresses');
  },
};
