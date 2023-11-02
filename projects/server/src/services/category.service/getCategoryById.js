const { ResponseError } = require('../../errors');
const { sequelize, Category } = require('../../models');

async function getCategoryById(req) {
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
    raw: true,
    logging: false,
  });
  if (!category) throw new ResponseError('category not found', 404);
  return category;
}

module.exports = getCategoryById;
