const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');

const stockMutationValidator = {
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
};

module.exports = stockMutationValidator;
