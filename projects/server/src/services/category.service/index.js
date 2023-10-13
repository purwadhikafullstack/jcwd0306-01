const createCategory = require('./createCategory');
const deleteCategoryById = require('./deleteCategoryById');
const editCategoryById = require('./editCategoryById');
const getCategories = require('./getCategories');
const getCategoryById = require('./getCategoryById');
const getCategoryImageById = require('./getCategoryImageById');

const categoryService = {
  createCategory,
  deleteCategoryById,
  editCategoryById,
  getCategories,
  getCategoryImageById,
  getCategoryById,
};

module.exports = categoryService;
