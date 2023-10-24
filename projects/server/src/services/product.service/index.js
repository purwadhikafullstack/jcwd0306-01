const getProductById = require('./getProductById');
const getProductImageByImageId = require('./getProductImageByImageId');
const getProducts = require('./getProducts');

const productService = {
  getProducts,
  getProductById,
  getProductImageByImageId,
};

module.exports = productService;
