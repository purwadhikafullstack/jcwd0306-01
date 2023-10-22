'use strict';

const { products } = require('../demos');

function getProductImages() {
  const productImages = [];
  let i = 1;
  for (const product of products) {
    for (const image of product.images) {
      productImages.push({
        id: i,
        productId: product.id,
        image: Buffer.from(image.data),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
      i += 1;
    }
  }
  return productImages;
}

function getProductImageIds() {
  const productImageIds = [];
  let i = 1;
  for (const product of products) {
    for (const _ of product.images) {
      productImageIds.push(i);
      i += 1;
    }
  }
  return productImageIds;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductImages', await getProductImages());
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductImages', {
      id: getProductImageIds(),
    });
  },
};
