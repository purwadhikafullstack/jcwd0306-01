const { ResponseError } = require('../../errors');
const { sequelize, Sequelize, Category } = require('../../models');

async function createCategory(req) {
  const category = await sequelize.transaction(
    { isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE },
    async (t) => {
      const [data, isCreated] = await Category.findOrCreate({
        where: { name: req.body.name },
        defaults: req.body,
        fields: ['name', 'image'],
        transaction: t,
      });
      if (!isCreated)
        throw new ResponseError('category name already exist', 400);
      return { ...data.toJSON(), image: undefined };
    }
  );
  return category;
}

module.exports = createCategory;
