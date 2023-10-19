'use strict';

const { carousels } = require('../demos');

function getCarousels() {
  return carousels.map((carouselimage) => ({
    id: carouselimage.id,
    image: Buffer.from(carouselimage.image.data),
    createdAt: carouselimage.createdAt,
    updatedAt: carouselimage.updatedAt,
  }));
}

function getCarouselIds() {
  return carousels.map(({ id }) => id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Carousels', getCarousels());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carousels', { id: getCarouselIds() });
  },
};
