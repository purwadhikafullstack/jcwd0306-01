const createProduct = require('./createProduct');
const editProductByProductId = require('./editProductByProductId');
const getProductByProductId = require('./getProductByProductId');
const getProductImageByImageId = require('./getProductImageByImageId');
const getProducts = require('./getProducts');

const productService = {
  createProduct,
  editProductByProductId,
  getProducts,
  getProductByProductId,
  getProductImageByImageId,
};

module.exports = productService;
