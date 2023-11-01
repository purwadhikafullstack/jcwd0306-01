const createProduct = require('./createProduct');
const getProductById = require('./getProductById');
const getProductImageByImageId = require('./getProductImageByImageId');
const getProducts = require('./getProducts');

const productService = {
  createProduct,
  getProducts,
  getProductById,
  getProductImageByImageId,
};

module.exports = productService;
