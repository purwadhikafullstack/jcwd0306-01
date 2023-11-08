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
  'CAST((SELECT IFNULL(SUM(op.quantity), 0) FROM OrderProducts AS op WHERE op.productId = Product.id) AS SIGNED)'
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

async function receiveProducts(req, filters) {
  const { categoryId, warehouseId } = req.query;

  const totalData = (
    await Product.findAll({
      where: filters.where,
      paranoid: filters.paranoid,
      attributes: [],
      include: [
        {
          model: Category,
          where: categoryId ? { id: categoryId } : undefined,
          attributes: [],
          through: { attributes: [], paranoid: filters.paranoid },
          paranoid: filters.paranoid,
        },
        {
          model: WarehouseProduct,
          where: warehouseId ? { warehouseId } : undefined,
          attributes: [],
          paranoid: filters.paranoid,
        },
      ],
    })
  ).length;

  const products = await Product.findAll({
    ...filters,
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
        through: { attributes: [], paranoid: filters.paranoid },
        paranoid: filters.paranoid,
        as: 'Categories_getProducts',
      },
      {
        model: WarehouseProduct,
        where: warehouseId ? { warehouseId } : undefined,
        attributes: ['warehouseId', 'stock'],
        paranoid: filters.paranoid,
      },
    ],
  });

  return [products, totalData];
}

async function getProducts(req) {
  const filters = generateFilters(req);

  const { isPaginated, page, perPage } = req.query;
  const [products, totalData] = await receiveProducts(req, filters);

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
