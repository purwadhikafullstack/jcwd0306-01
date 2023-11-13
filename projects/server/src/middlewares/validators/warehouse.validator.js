const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');
const { ResponseError } = require('../../errors');

const warehouseValidator = {
  createWarehouse: (req, res, next) => {
    try {
      validateJoiSchema(
        req.body,
        Joi.object({
          name: Joi.string().required(),
          country: Joi.string().required(),
          provinceId: Joi.number().integer().min(1).required(),
          cityId: Joi.number().integer().min(1).required(),
          district: Joi.string().required(),
          village: Joi.string().required(),
          detail: Joi.string().required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editWarehouseByWarehouseId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          warehouseId: Joi.number().integer().min(1).required(),
        }).required()
      );
      validateJoiSchema(
        req.body,
        Joi.object({
          name: Joi.string(),
          country: Joi.string(),
          provinceId: Joi.number().integer().min(1),
          cityId: Joi.number().integer().min(1),
          district: Joi.string()
            .when('provinceId', { is: Joi.exist(), then: Joi.required() })
            .when('cityId', { is: Joi.exist(), then: Joi.required() }),
          village: Joi.string()
            .when('provinceId', { is: Joi.exist(), then: Joi.required() })
            .when('cityId', { is: Joi.exist(), then: Joi.required() }),
          detail: Joi.string()
            .when('provinceId', { is: Joi.exist(), then: Joi.required() })
            .when('cityId', { is: Joi.exist(), then: Joi.required() }),
        })
          .and('provinceId', 'cityId')
          .required()
      );
      if (Object.keys(req.body).length === 0)
        // check at least one column of table to be updated
        throw new ResponseError('no data provided', 400);
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getWarehouseByWarehouseId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          warehouseId: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  updateWarehouseActivationByWarehouseId: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          warehouseId: Joi.number().integer().min(1).required(),
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
};

module.exports = warehouseValidator;
