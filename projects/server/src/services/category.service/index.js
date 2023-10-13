const createCategory = require('./createCategory');
const deleteCategoryById = require('./deleteCategoryById');
const getCategories = require('./getCategories');
const getCategoryImageById = require('./getCategoryImageById');

const categoryService = {
  createCategory,
  getCategories,
  getCategoryImageById,
  deleteCategoryById,
};

module.exports = categoryService;
