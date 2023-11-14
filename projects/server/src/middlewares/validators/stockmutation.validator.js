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
