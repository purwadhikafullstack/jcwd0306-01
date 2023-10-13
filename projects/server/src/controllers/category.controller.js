const sharp = require('sharp');
const { sendResponse } = require('../utils');
const { categoryService } = require('../services');

const categoryController = {
  createCategory: async (req, res) => {
    try {
      req.body.image = await sharp(req.file.buffer).png().toBuffer();
      const category = await categoryService.createCategory(req);
      sendResponse({ res, statusCode: 201, data: category });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await categoryService.getCategories();
      sendResponse({ res, statusCode: 200, data: categories });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategoryImageById: async (req, res) => {
    try {
      const image = await categoryService.getCategoryImageById(req);
      res.set('Content-type', 'image/png').send(image);
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = categoryController;
