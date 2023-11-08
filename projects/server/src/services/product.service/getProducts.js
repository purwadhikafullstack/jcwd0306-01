const { ResponseError } = require('../../errors');
const {
  sequelize,
  Sequelize,
  Category,
  Product,
  WarehouseProduct,
} = require('../../models');

const IMAGEIDS_QUERY = sequelize.literal(
  '(SELECT GROUP_CONCAT(pi.id) FROM ProductImages AS pi WHERE pi.productId = Product.id)'
);
const SOLD_QUERY = sequelize.literal(
  'CAST((SELECT IFNULL(SUM(op.quantity), 0) FROM OrderProducts AS op WHERE op.productId = Product.id) AS SIGNED)'
);
const STOCK_QUERY = sequelize.literal(
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
);

function generateFilters(req) {
  // set default values
  if (typeof req.query.paranoid !== 'boolean') req.query.paranoid = true;
  if (typeof req.query.isPaginated !== 'boolean') req.query.isPaginated = true;
  req.query.page = req.query.page || 1;
  req.query.perPage = req.query.perPage || 10;

  // query for sort by stock and sold
  if (req.query.sortBy === 'stock') req.query.sortBy = STOCK_QUERY;
  else if (req.query.sortBy === 'sold') req.query.sortBy = SOLD_QUERY;

  const { name, sortBy, orderBy, paranoid, isPaginated, page, perPage } =
    req.query;
  return {
    where: name ? { name: { [Sequelize.Op.like]: `%${name}%` } } : undefined,
    order: [[sortBy || 'updatedAt', orderBy || 'DESC']],
    limit: isPaginated ? perPage : undefined,
    offset: isPaginated ? (page - 1) * perPage : undefined,
    paranoid,
  };
}

async function getProductsForCategory(req, filters) {
  const category = await Category.findByPk(req.query.categoryId);
  if (!category) throw new ResponseError('invalid categoryId', 400);
  const totalData = await category.countProducts({
    where: filters.where,
    logging: false,
    paranoid: filters.paranoid,
  });
  const products = await category.getProducts({
    ...filters,
    logging: false,
    attributes: {
      include: [
        [SOLD_QUERY, 'sold'],
        [STOCK_QUERY, 'stock'],
        [IMAGEIDS_QUERY, 'imageIds'],
      ],
    },
    include: [
      {
        model: Category,
        attributes: ['id', 'name'],
        through: { attributes: [], paranoid: filters.paranoid },
        paranoid: filters.paranoid,
      },
      {
        model: WarehouseProduct,
        attributes: ['warehouseId', 'stock'],
        paranoid: filters.paranoid,
      },
    ],
    joinTableAttributes: [],
  });
  return [products, totalData];
}

async function getProductsForNoCategory(req, filters) {
  const totalData = await Product.count({
    where: filters.where,
    logging: false,
    paranoid: filters.paranoid,
  });
  const products = await Product.findAll({
    ...filters,
    logging: false,
    attributes: {
      include: [
        [SOLD_QUERY, 'sold'],
        [STOCK_QUERY, 'stock'],
        [IMAGEIDS_QUERY, 'imageIds'],
      ],
    },
    include: [
      {
        model: WarehouseProduct,
        attributes: ['warehouseId', 'stock'],
        paranoid: filters.paranoid,
      },
      {
        model: Category,
        attributes: ['id', 'name'],
        through: { attributes: [], paranoid: filters.paranoid },
        paranoid: filters.paranoid,
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
  const filters = generateFilters(req);

  const { categoryId, isPaginated, page, perPage } = req.query;
  const [products, totalData] = categoryId
    ? await getProductsForCategory(req, filters)
    : await getProductsForNoCategory(req, filters);

  convertProductImageIdsToArray(products);

  const paginationInfo = { totalData };
  if (isPaginated) {
    paginationInfo.currentPage = page;
    paginationInfo.perPage = perPage;
    paginationInfo.totalPage = Math.ceil(paginationInfo.totalData / perPage);
    paginationInfo.offset = filters.offset;
  }

  return [products, paginationInfo];
}

module.exports = getProducts;
