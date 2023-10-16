'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WarehouseAddresses', {
      warehouseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Warehouses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      country: { type: Sequelize.STRING, allowNull: false },
      provinceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Provinces', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Cities', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      district: { type: Sequelize.STRING, allowNull: false },
      village: { type: Sequelize.STRING, allowNull: false },
      detail: { type: Sequelize.STRING, allowNull: false },
      longitude: { type: Sequelize.DOUBLE, allowNull: false },
      latitude: { type: Sequelize.DOUBLE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WarehouseAddresses');
  },
};
