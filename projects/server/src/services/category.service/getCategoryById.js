const { ResponseError } = require('../../errors');
const { Category } = require('../../models');

async function getCategoryById(req) {
  const category = await Category.findByPk(req.params.id, {
    attributes: { exclude: ['image'] },
    raw: true,
    logging: false,
  });
  if (!category) throw new ResponseError('category not found', 404);
  return category;
}

module.exports = getCategoryById;
