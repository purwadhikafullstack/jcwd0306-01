'use strict';

const { products } = require('../demos');

function getProducts() {}

function getProductIds() {}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Products',
      products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        weight: product.weight,
        discount: product.discount,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', {
      id: products.map(({ id }) => id),
    });
  },
};
