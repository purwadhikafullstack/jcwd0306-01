const { ResponseError } = require('../../errors');
const { Category } = require('../../models');

async function getCategoryImageById(req) {
  const category = await Category.findByPk(req.params.id, {
    attributes: ['image'],
    raw: true,
    logging: false,
  });
  if (!category?.image)
    throw new ResponseError('category image not found', 404);
  return category.image;
}

module.exports = getCategoryImageById;
