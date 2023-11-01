const { ResponseError } = require('../../errors');
const {
  sequelize,
  Category,
  Product,
  WarehouseProduct,
} = require('../../models');

async function getProductsForCategory(req) {
  const category = await Category.findByPk(req.query.categoryId);
  if (!category) throw new ResponseError('invalid categoryId', 400);
  const totalData = await category.countProducts({ where: req.locals.where });
  const products = await category.getProducts({
    ...req.locals,
    attributes: {
      include: [
        [
          sequelize.literal(
            'CAST((SELECT IFNULL(SUM(wp.stock), 0) FROM WarehouseProducts AS wp WHERE wp.productId = Product.id) AS SIGNED)'
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
      {
        model: Category,
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
      { model: WarehouseProduct, attributes: ['warehouseId', 'stock'] },
    ],
    joinTableAttributes: [],
  });
  return [products, totalData];
}

async function getProductsForNoCategory(req) {
  const totalData = await Product.count({ where: req.locals.where });
  const products = await Product.findAll({
    ...req.locals,
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
  return [products, totalData];
}

function convertProductImageIdsToArray(products) {
  // this function is used to convert string to be array of number
  // because previously subquery 'GROUP_CONCAT' returned string
  products.forEach((product) => {
    product.setDataValue(
      'imageIds',
      product.getDataValue('imageIds')
        ? product.getDataValue('imageIds').split(',').map(Number)
        : []
    );
  });
}

async function getProducts(req) {
  const [products, totalData] = req.query.categoryId
    ? await getProductsForCategory(req)
    : await getProductsForNoCategory(req);

  convertProductImageIdsToArray(products);

  const paginationInfo = { totalData };
  if (req.query.isPaginated !== 'false') {
    paginationInfo.currentPage = req.query.page;
    paginationInfo.perPage = req.query.perPage;
    paginationInfo.totalPage = Math.ceil(
      paginationInfo.totalData / req.query.perPage
    );
  }

  return [products, paginationInfo];
}

module.exports = getProducts;
