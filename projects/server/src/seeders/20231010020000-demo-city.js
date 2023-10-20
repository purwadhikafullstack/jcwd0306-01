'use strict';

const { cities } = require('../demos');

function getCities() {
  return cities.map((city) => ({
    id: +city.city_id,
    provinceId: +city.province_id,
    name: city.city_name,
    createdAt: new Date(2023, 3, 1),
    updatedAt: new Date(2023, 3, 1),
  }));
}

function getCityIds() {
  return cities.map((city) => city.city_id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cities', getCities());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities', { id: getCityIds() });
  },
};
