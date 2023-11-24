'use strict';

const { carousels } = require('../demos');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Carousels',
      carousels.map((carouselimage) => ({
        id: carouselimage.id,
        image: Buffer.from(carouselimage.image.data),
        createdAt: carouselimage.createdAt,
        updatedAt: carouselimage.updatedAt,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carousels', {
      id: carousels.map(({ id }) => id),
    });
  },
};
