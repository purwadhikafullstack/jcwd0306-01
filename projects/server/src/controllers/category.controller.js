const sharp = require('sharp');
const { sendResponse } = require('../utils');
const { categoryService } = require('../services');

const categoryController = {
  createCategory: async (req, res) => {
    try {
      req.body.image = await sharp(req.file.buffer).png().toBuffer();
      const categoryData = await categoryService.createCategory(req);
      sendResponse({
        res,
        statusCode: 201,
        data: categoryData,
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = categoryController;
