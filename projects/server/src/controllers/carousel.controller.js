const sharp = require('sharp');
const { sendResponse } = require('../utils');
const { carouselService } = require('../services');

const carouselController = {
  createCarousel: async (req, res) => {
    try {
      req.body.image = await sharp(req.file.buffer).png().toBuffer();
      const carousel = await carouselService.createCarousel(req);
      sendResponse({ res, statusCode: 201, data: carousel });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCarousels: async (req, res) => {
    try {
      const carousels = await carouselService.getCarousels();
      sendResponse({ res, statusCode: 200, data: carousels });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCarouselImageById: async (req, res) => {
    try {
      const image = await carouselService.getCarouselImageById(req);
      res.set('Content-type', 'image/png').send(image);
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = carouselController;
