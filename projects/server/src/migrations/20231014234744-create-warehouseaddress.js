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
      province: { type: Sequelize.STRING, allowNull: false },
      city: { type: Sequelize.STRING, allowNull: false },
      district: { type: Sequelize.STRING, allowNull: false },
      village: { type: Sequelize.STRING, allowNull: false },
      detail: { type: Sequelize.STRING, allowNull: false },
      longitude: { type: Sequelize.FLOAT, allowNull: false },
      latitude: { type: Sequelize.FLOAT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WarehouseAddresses');
  },
};
