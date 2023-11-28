const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');

const stockMutationValidator = {
  createStockMutation: (req, res, next) => {
    try {
      validateJoiSchema(
        req.body,
        Joi.object({
          type: Joi.string().valid('request', 'order').required(),
          productId: Joi.number().integer().min(1).required(),
          fromWarehouseId: Joi.number().integer().min(1).required(),
          toWarehouseId: Joi.number().integer().min(1).required(),
          quantity: Joi.number().integer().min(1).required(),
          orderId: Joi.when('type', {
            is: 'order',
            then: Joi.number().integer().min(1).required(),
            otherwise: Joi.forbidden(),
          }),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteStockMutationByStockMutationId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          stockMutationId: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getStockMutationByStockMutationId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          stockMutationId: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getStockMutations: (req, res, next) => {
    try {
      // convert data type
      if (req.query.warehouseId)
        req.query.warehouseId = Number(req.query.warehouseId);
      if (req.query.page) req.query.page = Number(req.query.page);
      if (req.query.perPage) req.query.perPage = Number(req.query.perPage);

      validateJoiSchema(
        req.query,
        Joi.object({
          search: Joi.string().allow(''),
          warehouseId: Joi.number().integer().min(1).allow(''),
          status: Joi.string()
            .valid('rejected', 'requested', 'processed', 'shipped', 'received')
            .allow(''),
          type: Joi.string().valid('request', 'order').allow(''),
          sortBy: Joi.string()
            .valid(
              'id',
              'status',
              'quantity',
              'type',
              'orderId',
              'createdAt',
              'updatedAt',
              'product-name',
              'from-wh-name',
              'to-wh-name'
            )
            .allow(''),
          orderBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc').allow(''),
          page: Joi.number().integer().min(1).allow(''),
          perPage: Joi.number().integer().min(1).allow(''),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  updateStockMutationStatusByStockMutationId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          stockMutationId: Joi.number().integer().min(1).required(),
        }).required()
      );
      validateJoiSchema(
        req.body,
        Joi.object({
          status: Joi.string()
            .valid('rejected', 'processed', 'shipped', 'received')
            .required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = stockMutationValidator;
