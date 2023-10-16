'use strict';

const { products } = require('../demos');

function getProducts() {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    weight: product.weight,
    discount: product.discount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
}

function getProductIds() {
  return products.map(({ id }) => id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', getProducts());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', { id: getProductIds() });
  },
};
