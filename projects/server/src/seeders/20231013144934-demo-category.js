'use strict';

const { categories } = require('../demos');

function getCategories() {
  const newCategories = [];
  for (const category of categories) {
    newCategories.push({
      id: category.id,
      name: category.name,
      image: Buffer.from(category.image.data),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }
  return newCategories;
}

function getCategoryIds() {
  return categories.map(({ id }) => id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', getCategories());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', { id: getCategoryIds() });
  },
};
