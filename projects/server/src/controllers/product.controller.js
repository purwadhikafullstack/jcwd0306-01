const { Op } = require('sequelize');
const { productService } = require('../services');
const { sendResponse } = require('../utils');

const productController = {
  createProduct: async (req, res) => {
    try {
      const product = await productService.createProduct(req);
      sendResponse({ res, statusCode: 201, data: product });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editProductByProductId: async (req, res) => {
    try {
      const product = await productService.editProductByProductId(req);
      sendResponse({ res, statusCode: 200, data: product });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProducts: async (req, res) => {
    try {
      const { name, sortBy, orderBy, isPaginated } = req.query;
      req.locals = {};
      req.locals.order = [[sortBy || 'updatedAt', orderBy || 'DESC']];
      req.locals.where = {};
      if (name) req.locals.where.name = { [Op.like]: `%${name}%` };
      if (isPaginated !== 'false') {
        req.query.page = +req.query.page || 1;
        req.query.perPage = +req.query.perPage || 1;
        req.locals.limit = req.query.perPage;
        req.locals.offset = (req.query.page - 1) * req.query.perPage;
      }
      const [products, paginationInfo] = await productService.getProducts(req);
      sendResponse({ res, statusCode: 200, data: products, ...paginationInfo });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductByProductId: async (req, res) => {
    try {
      const product = await productService.getProductByProductId(
        req.params.productId
      );
      sendResponse({ res, statusCode: 200, data: product });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductImageByImageId: async (req, res) => {
    try {
      const image = await productService.getProductImageByImageId(req);
      res.set('Content-type', 'image/png').send(image);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  updateProductActivationByProductId: async (req, res) => {
    try {
      const product =
        await productService.updateProductActivationByProductId(req);
      sendResponse({ res, statusCode: 200, data: product });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = productController;
