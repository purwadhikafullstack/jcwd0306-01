const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');

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
          longitude: Joi.number().required(),
          latitude: Joi.number().required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = warehouseValidator;
