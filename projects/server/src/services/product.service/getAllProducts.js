const { Product } = require('../../models');

async function getAllProduct() {
  const products = await Product.findAll({
    attributes: ['name'],
    logging: false,
    raw: true,
  });

  return products;
}

module.exports = getAllProduct;
