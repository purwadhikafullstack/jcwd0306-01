const { Category } = require('../../models');

async function getCategories() {
  const categories = await Category.findAll({
    attributes: { exclude: ['image'] },
    raw: true,
  });
  return categories;
}

module.exports = getCategories;
