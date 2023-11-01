const { Category } = require('../../models');

async function getCategories() {
  const categories = await Category.findAll({
    attributes: { exclude: ['image'] },
    raw: true,
    logging: false,
  });
  return categories;
}

module.exports = getCategories;
