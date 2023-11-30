const { ResponseError } = require('../../errors');
const { sequelize, Category } = require('../../models');

async function createCategory(req) {
  const category = await sequelize.transaction(
    { logging: false },
    async (t) => {
      const [data, isCreated] = await Category.findOrCreate({
        where: { name: req.body.name },
        defaults: req.body,
        fields: ['name', 'image'],
        transaction: t,
        logging: false,
      });
      if (!isCreated)
        throw new ResponseError('category name already exist', 400);
      data.setDataValue('image', undefined);
      data.setDataValue('totalProducts', 0);
      return data;
    }
  );
  return category;
}

module.exports = createCategory;
