const getProductImageByImageId = require('./getProductImageByImageId');
const getProducts = require('./getProducts');

const productService = {
  getProducts,
  getProductImageByImageId,
};

module.exports = productService;
