const createCategory = require('./createCategory');
const getCategories = require('./getCategories');
const getCategoryImageById = require('./getCategoryImageById');

const categoryService = {
  createCategory,
  getCategories,
  getCategoryImageById,
};

module.exports = categoryService;
