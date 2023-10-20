'use strict';

const { provinces } = require('../demos');

function getProvinces() {
  return provinces.map((province) => ({
    id: +province.province_id,
    name: province.province,
    createdAt: new Date(2023, 3, 1),
    updatedAt: new Date(2023, 3, 1),
  }));
}

function getProvinceIds() {
  return provinces.map((province) => province.province_id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Provinces', getProvinces());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Provinces', { id: getProvinceIds() });
  },
};
