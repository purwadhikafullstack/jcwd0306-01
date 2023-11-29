const { ResponseError } = require('../../errors');
const { sequelize, Category } = require('../../models');

async function checkCategoryNameUniqueness(req, transaction) {
  const category = await Category.findOne({
    where: { name: req.body.name },
    transaction,
    logging: false,
  });
  if (category && category.getDataValue('id') !== +req.params.id)
    throw new ResponseError('category name already exist', 400);
}

async function updateCategory(req, transaction) {
  const [numUpdatedCategory] = await Category.update(req.body, {
    where: { id: req.params.id },
    fields: ['name', 'image'],
    transaction,
    logging: false,
  });
  if (numUpdatedCategory === 0)
    throw new ResponseError('category not found', 404);
}

async function getCategory(req, transaction) {
  const category = await Category.findByPk(req.params.id, {
    attributes: {
      include: [
        [
          sequelize.literal(
            `CAST(
              (
                SELECT 
                  COUNT(*) 
                FROM 
                  ProductCategories AS pc 
                WHERE 
                  pc.categoryId = Category.id 
              ) AS SIGNED
            )`
          ),
          'totalProducts',
        ],
      ],
      exclude: ['image'],
    },
    transaction,
    logging: false,
  });
  return category;
}

async function editCategoryById(req) {
  const category = await sequelize.transaction(
    { logging: false },
    async (t) => {
      if (req.body.name) await checkCategoryNameUniqueness(req, t);
      await updateCategory(req, t);
      const data = await getCategory(req, t);
      return data;
    }
  );
  return category;
}

module.exports = editCategoryById;
