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
};

module.exports = carouselValidator;
