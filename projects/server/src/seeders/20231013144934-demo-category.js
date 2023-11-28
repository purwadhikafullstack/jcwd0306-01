'use strict';

const { categories } = require('../demos');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Categories',
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        image: Buffer.from(category.image.data),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {
      id: categories.map(({ id }) => id),
    });
  },
};
