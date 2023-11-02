const { sequelize, Category } = require('../../models');

async function getCategories(req) {
  const categories = await Category.findAll({
    ...req.locals,
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
  return categories;
}

module.exports = getCategories;
