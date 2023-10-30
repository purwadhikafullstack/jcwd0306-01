const sharp = require('sharp');
const { Op } = require('sequelize');
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

  deleteCategoryById: async (req, res) => {
    try {
      await categoryService.deleteCategoryById(req);
      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editCategoryById: async (req, res) => {
    try {
      if (req.file)
        req.body.image = await sharp(req.file.buffer).png().toBuffer();
      const category = await categoryService.editCategoryById(req);
      sendResponse({ res, statusCode: 200, data: category });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getCategories: async (req, res) => {
    try {
      const { name, sortBy, orderBy } = req.query;
      req.locals = {
        order: [[sortBy || 'updatedAt', orderBy || 'DESC']],
        where: name ? { name: { [Op.like]: `%${name}%` } } : {},
      };
      const categories = await categoryService.getCategories(req);
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

  getCategoryById: async (req, res) => {
    try {
      const category = await categoryService.getCategoryById(req);
      sendResponse({ res, statusCode: 200, data: category });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = categoryController;
