const Joi = require('joi');
const { validateJoiSchema, sendResponse } = require('../../utils');

const warehouseUserValidator = {
  createWarehouseUserByWarehouseId: (req, res, next) => {
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
          userIds: Joi.array()
            .items(Joi.number().integer().min(1).required())
            .required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = warehouseUserValidator;
