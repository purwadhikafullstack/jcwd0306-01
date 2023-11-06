const { ResponseError } = require('../../errors');
const { Category } = require('../../models');

async function deleteCategoryById(req) {
  const result = await Category.destroy({
    where: { id: req.params.id },
    force: true,
  });
  if (!result) throw new ResponseError('category not found', 404);
}

module.exports = deleteCategoryById;
