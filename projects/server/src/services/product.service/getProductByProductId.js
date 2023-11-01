const { ResponseError } = require('../../errors');
const {
  sequelize,
  Product,
  Category,
  WarehouseProduct,
} = require('../../models');

function convertProductImageIdsToArray(product) {
  // this function is used to convert string to be array of number
  // because previously subquery 'GROUP_CONCAT' returned string
  product.setDataValue(
    'imageIds',
    product.getDataValue('imageIds')
      ? product.getDataValue('imageIds').split(',').map(Number)
      : []
  );
}

async function getProductByProductId(req, transaction) {
  const product = await Product.findByPk(req.params.productId, {
    transaction,
    attributes: {
      include: [
        [
          sequelize.literal(
            `CAST(
              (
                SELECT 
                  IFNULL(SUM(wp.stock), 0) 
                FROM 
                  WarehouseProducts AS wp 
                WHERE 
                  wp.productId = Product.id 
                  AND wp.deletedAt IS NULL
              ) AS SIGNED
            )`
          ),
          'stock',
        ],
        [
          sequelize.literal(
            'CAST((SELECT IFNULL(SUM(op.quantity), 0) FROM OrderProducts AS op WHERE op.productId = Product.id) AS SIGNED)'
          ),
          'sold',
        ],
        [
          sequelize.literal(
            '(SELECT GROUP_CONCAT(pi.id) FROM ProductImages AS pi WHERE pi.productId = Product.id)'
          ),
          'imageIds',
        ],
      ],
    },
    include: [
      { model: WarehouseProduct, attributes: ['warehouseId', 'stock'] },
      {
        model: Category,
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    ],
  });
  if (!product) throw new ResponseError('product not found', 404);
  convertProductImageIdsToArray(product);
  return product;
}

module.exports = getProductByProductId;
