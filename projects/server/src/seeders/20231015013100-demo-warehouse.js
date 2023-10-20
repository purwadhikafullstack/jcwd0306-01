'use strict';

const { warehouses } = require('../demos');

function getWarehouses() {
  return warehouses.map((warehouse) => ({
    id: warehouse.id,
    name: warehouse.name,
    createdAt: warehouse.createdAt,
    updatedAt: warehouse.updatedAt,
  }));
}

function getWarehouseIds() {
  return warehouses.map(({ id }) => id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Warehouses', getWarehouses());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Warehouses', { id: getWarehouseIds() });
  },
};
