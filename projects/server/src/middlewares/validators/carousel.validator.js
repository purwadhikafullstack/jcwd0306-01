const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');

const carouselValidator = {
  createCarousel: (req, res, next) => {
    try {
      validateJoiSchema(req.file, Joi.required().label('image'));
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCarouselImageById: (req, res, next) => {
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

module.exports = carouselValidator;
