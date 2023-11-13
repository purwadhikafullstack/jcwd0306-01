const Joi = require('joi');
const sharp = require('sharp');
const { sendResponse, validateJoiSchema } = require('../../utils');
const { ResponseError } = require('../../errors');

const productValidator = {
  createProduct: async (req, res, next) => {
    try {
      // convert categoryIds : string -> array
      if (req.body.categoryIds)
        req.body.categoryIds = JSON.parse(req.body.categoryIds);

      // assign image files to req.body
      req.body.images = await Promise.all(
        req.files.map((file) => sharp(file.buffer).png().toBuffer())
      );
      validateJoiSchema(
        req.body,
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          price: Joi.number().integer().min(0).required(),
          weight: Joi.number().min(0).required(),
          discount: Joi.number().min(0).max(1),
          categoryIds: Joi.array().items(Joi.number().integer().min(1)),
          images: Joi.array().items(Joi.binary().required()).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editProductByProductId: async (req, res, next) => {
    try {
      // convert categoryIds & imageIdsToDelete : string -> array
      if (req.body.categoryIds)
        req.body.categoryIds = JSON.parse(req.body.categoryIds);
      if (req.body.imageIdsToDelete)
        req.body.imageIdsToDelete = JSON.parse(req.body.imageIdsToDelete);

      // assign image files to req.body
      req.body.images = await Promise.all(
        req.files.map((file) => sharp(file.buffer).png().toBuffer())
      );
      validateJoiSchema(
        req.params,
        Joi.object({
          productId: Joi.number().integer().min(1).required(),
        }).required()
      );
      validateJoiSchema(
        req.body,
        Joi.object({
          name: Joi.string(),
          description: Joi.string(),
          price: Joi.number().integer().min(0),
          weight: Joi.number().min(0),
          discount: Joi.number().min(0).max(1),
          categoryIds: Joi.array().items(Joi.number().integer().min(1)),
          images: Joi.array().items(Joi.binary()),
          imageIdsToDelete: Joi.array().items(Joi.number().integer().min(1)),
        }).required()
      );
      if (Object.keys(req.body).length === 0)
        // check at least one column of table to be updated
        throw new ResponseError('no data provided', 400);
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProducts: (req, res, next) => {
    try {
      // convert data type
      if (req.query.paranoid)
        req.query.paranoid = JSON.parse(req.query.paranoid);
      if (req.query.isPaginated)
        req.query.isPaginated = JSON.parse(req.query.isPaginated);
      if (req.query.categoryId)
        req.query.categoryId = Number(req.query.categoryId);
      if (req.query.warehouseId)
        req.query.warehouseId = Number(req.query.warehouseId);
      if (req.query.page) req.query.page = Number(req.query.page);
      if (req.query.perPage) req.query.perPage = Number(req.query.perPage);

      validateJoiSchema(
        req.query,
        Joi.object({
          name: Joi.string().allow(''),
          categoryId: Joi.number().integer().min(1).allow(''),
          warehouseId: Joi.number().integer().min(1).allow(''),
          sortBy: Joi.string()
            .valid(
              'id',
              'name',
              'description',
              'price',
              'weight',
              'discount',
              'createdAt',
              'updatedAt',
              'deletedAt',
              'stock',
              'inactive-stock',
              'sold'
            )
            .allow(''),
          orderBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc').allow(''),
          paranoid: Joi.boolean().allow(''),
          isPaginated: Joi.boolean().allow(''),
          page: Joi.number().integer().min(1).allow(''),
          perPage: Joi.number().integer().min(1).allow(''),
        })
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductByProductId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          productId: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductImageByImageId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          imageId: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  updateProductActivationByProductId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          productId: Joi.number().integer().min(1).required(),
        }).required()
      );
      validateJoiSchema(
        req.query,
        Joi.object({
          action: Joi.string().valid('activate', 'deactivate').required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  updateWarehouseProductStock: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          productId: Joi.number().integer().min(1).required(),
        }).required()
      );
      validateJoiSchema(
        req.body,
        Joi.object({
          warehouseId: Joi.number().integer().min(1).required(),
          quantity: Joi.number().integer().required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = productValidator;
