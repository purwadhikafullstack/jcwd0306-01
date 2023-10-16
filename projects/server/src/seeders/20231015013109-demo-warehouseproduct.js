'use strict';

const { products } = require('../demos');

function getWarehouseProducts() {
  const warehouseProducts = [];
  for (const product of products) {
    for (const warehouse of product.warehouses) {
      warehouseProducts.push({
        warehouseId: warehouse.warehouseId,
        productId: product.id,
        stock: warehouse.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }
  }
  return warehouseProducts;
}

function getProductIds() {
  return products.map(({ id }) => id);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'WarehouseProducts',
      getWarehouseProducts()
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WarehouseProducts', {
      productId: getProductIds(),
    });
  },
};
