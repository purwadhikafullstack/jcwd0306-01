const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');

const productValidator = {
  getProducts: (req, res, next) => {
    try {
      validateJoiSchema(
        req.query,
        Joi.object({
          name: Joi.string().allow(''),
          categoryId: Joi.number().integer().min(1).allow(''),
          sortBy: Joi.string()
            .valid(
              'id',
              'name',
              'description',
              'price',
              'weight',
              'discount',
              'createdAt',
              'updatedAt'
            )
            .allow(''),
          orderBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc').allow(''),
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
};

module.exports = productValidator;
