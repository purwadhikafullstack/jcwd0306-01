const { OrderProduct } = require('../../models');

async function getProductSold() {
  const data = await OrderProduct.findAll({
    attributes: ['quantity', 'updatedAt', 'productId'],
    logging: false,
  });
  return data;
}

module.exports = getProductSold;
