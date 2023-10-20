'use strict';

const { warehouses } = require('../demos');

function getWarehouseAddresses() {
  return warehouses.map((warehouse) => ({
    warehouseId: warehouse.id,
    country: warehouse.country,
    provinceId: warehouse.provinceId,
    cityId: warehouse.cityId,
    district: warehouse.district,
    village: warehouse.village,
    detail: warehouse.detail,
    longitude: warehouse.longitude,
    latitude: warehouse.latitude,
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
    await queryInterface.bulkInsert(
      'WarehouseAddresses',
      getWarehouseAddresses()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WarehouseAddresses', {
      warehouseId: getWarehouseIds(),
    });
  },
};
