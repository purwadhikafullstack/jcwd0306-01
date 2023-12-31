const {
  sequelize,
  Sequelize,
  Category,
  Product,
  WarehouseProduct,
} = require('../../models');

const IMAGEIDS_QUERY = sequelize.literal(
  '(SELECT JSON_ARRAYAGG(pi.id) FROM ProductImages AS pi WHERE pi.productId = Product.id)'
);
const SOLD_QUERY = sequelize.literal(
  `CAST(
    IFNULL((
      SELECT 
        IFNULL(SUM(op.quantity), 0) AS sold 
      FROM OrderProducts op 
      LEFT JOIN Orders o ON o.id = op.orderId 
      WHERE o.status IN ('processed', 'shipped', 'received') AND op.productId = Product.id
      GROUP BY op.productId 
    ), 0) AS SIGNED
  )`
);
const STOCK_QUERY = sequelize.literal(
  `CAST( 
    ( 
      SELECT IFNULL(SUM(wp.stock), 0) 
      FROM WarehouseProducts AS wp 
      WHERE wp.productId = Product.id AND wp.deletedAt IS NULL 
    ) AS SIGNED 
  )`
);
const INACTIVE_STOCK_QUERY = sequelize.literal(
  `CAST( 
    ( 
      SELECT IFNULL(SUM(wp.stock), 0) 
      FROM WarehouseProducts AS wp 
      WHERE wp.productId = Product.id AND wp.deletedAt IS NOT NULL 
    ) AS SIGNED 
  )`
);
const CATEGORIES_QUERY = sequelize.literal(
  `( 
    SELECT Categories 
    FROM ( 
      SELECT 
        p.id AS productId,
        CASE 
          WHEN c.id IS NULL 
          THEN JSON_ARRAY() 
          ELSE JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name)) 
        END AS Categories 
      FROM Products p 
      LEFT JOIN ProductCategories pc ON p.id = pc.productId 
      LEFT JOIN Categories c ON pc.categoryId = c.id 
      GROUP BY p.id 
    ) c 
    WHERE c.productId = Product.id 
  )`
);

function generateFilters(req) {
  // set default values
  if (typeof req.query.paranoid !== 'boolean') req.query.paranoid = true;
  if (typeof req.query.isPaginated !== 'boolean') req.query.isPaginated = true;
  req.query.sortBy = req.query.sortBy || 'updatedAt';
  req.query.orderBy = req.query.orderBy || 'DESC';
  req.query.page = req.query.page || 1;
  req.query.perPage = req.query.perPage || 10;

  // query for sort by stock and sold
  if (req.query.sortBy === 'stock' && !req.query.warehouseId)
    req.query.sortBy = STOCK_QUERY;
  else if (req.query.sortBy === 'inactive-stock')
    req.query.sortBy = INACTIVE_STOCK_QUERY;
  else if (req.query.sortBy === 'sold') req.query.sortBy = SOLD_QUERY;

  const {
    search,
    categoryId,
    warehouseId,
    sortBy,
    orderBy,
    paranoid,
    isPaginated,
    page,
    perPage,
  } = req.query;

  return {
    logging: false,
    subQuery: !warehouseId, //
    where: {
      [Sequelize.Op.or]: {
        name: { [Sequelize.Op.like]: `%${search || ''}%` },
        description: { [Sequelize.Op.like]: `%${search || ''}%` },
      },
    },
    attributes: {
      include: [
        [SOLD_QUERY, 'sold'],
        [STOCK_QUERY, 'stock'],
        [INACTIVE_STOCK_QUERY, 'inactiveStock'],
        [IMAGEIDS_QUERY, 'imageIds'],
        [CATEGORIES_QUERY, 'Categories'],
      ],
    },
    include: [
      {
        model: Category,
        where: categoryId ? { id: categoryId } : undefined,
        attributes: [],
        through: { attributes: [], paranoid },
        paranoid,
        as: 'Categories_getProducts',
      },
      {
        model: WarehouseProduct,
        where: warehouseId ? { warehouseId } : undefined,
        paranoid,
      },
    ],
    order:
      req.query.warehouseId &&
      ['stock', 'createdAt', 'updatedAt', undefined].includes(sortBy)
        ? [[WarehouseProduct, sortBy, orderBy]]
        : [[sortBy, orderBy]],
    limit: isPaginated ? perPage : undefined,
    offset: isPaginated ? (page - 1) * perPage : undefined,
    paranoid,
  };
}

async function receiveProducts(req, filters) {
  const totalData = (
    await Product.findAll({ ...filters, limit: undefined, offset: undefined })
  ).length;
  const products = await Product.findAll({ ...filters });
  return [products, totalData];
}

async function getProducts(req) {
  const filters = generateFilters(req);
  const [products, totalData] = await receiveProducts(req, filters);

  const { isPaginated, page, perPage } = req.query;
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
