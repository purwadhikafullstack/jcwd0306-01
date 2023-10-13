const Joi = require('joi');
const { sendResponse } = require('../../utils');
const { ResponseError } = require('../../errors');

const categoryValidator = {
  createCategory: (req, res, next) => {
    try {
      // validate req.file
      const schemaFile = Joi.required().label('image');
      const resultFile = schemaFile.validate(req.file);
      if (resultFile.error)
        throw new ResponseError(resultFile.error?.message, 400);

      // validate req.body
      const schemaBody = Joi.object({
        name: Joi.string().required(),
      }).required();
      const resultBody = schemaBody.validate(req.body);
      if (resultBody.error)
        throw new ResponseError(resultBody.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteCategoryById: (req, res, next) => {
    try {
      // validate req.params
      const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
      }).required();
      const result = schema.validate(req.params);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editCategoryById: (req, res, next) => {
    try {
      // validate req.params
      const schemaParams = Joi.object({
        id: Joi.number().integer().min(1).required(),
      }).required();
      const resultParams = schemaParams.validate(req.params);
      if (resultParams.error)
        throw new ResponseError(resultParams.error?.message, 400);

      // validate req.file
      const schemaFile = Joi.optional().label('image');
      const resultFile = schemaFile.validate(req.file);
      if (resultFile.error)
        throw new ResponseError(resultFile.error?.message, 400);

      // validate req.body
      const schemaBody = Joi.object({ name: Joi.string() }).required();
      const resultBody = schemaBody.validate(req.body);
      if (resultBody.error)
        throw new ResponseError(resultBody.error?.message, 400);

      // check at least one column of table to be updated
      if (!req.file && Object.keys(req.body).length === 0)
        throw new ResponseError('no data provided', 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategoryImageById: (req, res, next) => {
    try {
      // validate req.params
      const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
      }).required();
      const result = schema.validate(req.params);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategoryById: (req, res, next) => {
    try {
      // validate req.params
      const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
      }).required();
      const result = schema.validate(req.params);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = categoryValidator;
