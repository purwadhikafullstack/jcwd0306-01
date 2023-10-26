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
          isActive: Joi.boolean(),
          country: Joi.string().required(),
          provinceId: Joi.number().integer().min(1).required(),
          cityId: Joi.number().integer().min(1).required(),
          district: Joi.string().required(),
          village: Joi.string().required(),
          detail: Joi.string().required(),
          longitude: Joi.number().required(),
          latitude: Joi.number().required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteWarehouseByWarehouseId: (req, res, next) => {
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
          isActive: Joi.boolean(),
          country: Joi.string(),
          provinceId: Joi.number().integer().min(1),
          cityId: Joi.number().integer().min(1),
          district: Joi.string(),
          village: Joi.string(),
          detail: Joi.string(),
          longitude: Joi.number(),
          latitude: Joi.number(),
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
};

module.exports = warehouseValidator;
