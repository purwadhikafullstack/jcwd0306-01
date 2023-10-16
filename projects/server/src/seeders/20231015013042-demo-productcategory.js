'use strict';

const { products } = require('../demos');

function getProductCategories() {
  const productCategories = [];
  for (const product of products) {
    for (const categoryId of product.categories) {
      productCategories.push({
        productId: product.id,
        categoryId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }
  }
  return productCategories;
}

function getProductIds() {
  return products.map(({ id }) => id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ProductCategories',
      getProductCategories()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCategories', {
      productId: getProductIds(),
    });
  },
};
