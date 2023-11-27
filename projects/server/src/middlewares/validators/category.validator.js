const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');
const { ResponseError } = require('../../errors');

const categoryValidator = {
  createCategory: (req, res, next) => {
    try {
      validateJoiSchema(req.file, Joi.required().label('image'));
      validateJoiSchema(
        req.body,
        Joi.object({
          name: Joi.string().required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteCategoryById: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          id: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editCategoryById: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          id: Joi.number().integer().min(1).required(),
        }).required()
      );
      validateJoiSchema(req.file, Joi.optional().label('image'));
      validateJoiSchema(
        req.body,
        Joi.object({ name: Joi.string() }).required()
      );
      if (!req.file && Object.keys(req.body).length === 0)
        // check at least one column of table to be updated
        throw new ResponseError('no data provided', 400);
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategories: (req, res, next) => {
    try {
      // convert data type
      if (req.query.pagination)
        req.query.pagination = JSON.parse(req.query.pagination);
      if (req.query.page) req.query.page = Number(req.query.page);
      if (req.query.perPage) req.query.perPage = Number(req.query.perPage);

      validateJoiSchema(
        req.query,
        Joi.object({
          search: Joi.string().allow(''),
          sortBy: Joi.string()
            .valid('id', 'name', 'totalProducts', 'createdAt', 'updatedAt')
            .allow(''),
          orderBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc').allow(''),
          pagination: Joi.boolean().allow(''),
          page: Joi.number().integer().min(1).allow(''),
          perPage: Joi.number().integer().min(1).allow(''),
        })
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategoryById: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          id: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategoryImageById: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          id: Joi.number().integer().min(1).required(),
        }).required()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = categoryValidator;
