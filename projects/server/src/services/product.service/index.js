const createProduct = require('./createProduct');
const editProductByProductId = require('./editProductByProductId');
const getProductByProductId = require('./getProductByProductId');
const getProductImageByImageId = require('./getProductImageByImageId');
const getProducts = require('./getProducts');
const updateProductActivationByProductId = require('./updateProductActivationByProductId');
const updateWarehouseProductStock = require('./updateWarehouseProductStock');
const getTotalProducts = require('./getTotalProducts');
const getAllProducts = require('./getAllProducts');

const productService = {
  createProduct,
  editProductByProductId,
  getProducts,
  getProductByProductId,
  getProductImageByImageId,
  updateProductActivationByProductId,
  updateWarehouseProductStock,
  getTotalProducts,
  getAllProducts,
};

module.exports = productService;
