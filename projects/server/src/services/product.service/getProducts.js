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
const CATEGORIES_QUERY = sequelize.literal(
  `(
    SELECT Categories
    FROM (
      SELECT p.id AS productId, GROUP_CONCAT(CONCAT_WS(',', c.id, c.name) SEPARATOR ';') AS Categories
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
  const { categoryId } = req.query;

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
      ],
    })
  ).length;

  const products = await Product.findAll({
    ...filters,
    attributes: {
      include: [
        [SOLD_QUERY, 'sold'],
        [STOCK_QUERY, 'stock'],
        [IMAGEIDS_QUERY, 'imageIds'],
        [CATEGORIES_QUERY, 'Categories'],
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
        where: categoryId ? { id: categoryId } : undefined,
        attributes: [],
        through: { attributes: [], paranoid: filters.paranoid },
        paranoid: filters.paranoid,
        as: 'Categories_getProducts',
      },
    ],
  });

  return [products, totalData];
}

function convertImageIdsToArray(products) {
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

function convertCategoriesToArray(products) {
  // this function is used to convert:
  // eg.  from  : "2,Desktop;4,Game Console"
  //      to    : [{id: 2, name: "Desktop"}, {id: 4, name: "Game Console"}]
  products.forEach((product) => {
    product.setDataValue(
      'Categories',
      product.getDataValue('Categories')
        ? product
            .getDataValue('Categories')
            .split(';')
            .map((strCategory) => {
              const arrCategory = strCategory.split(',');
              return {
                id: Number(arrCategory[0]),
                name: arrCategory[1],
              };
            })
        : []
    );
  });
}

async function getProducts(req) {
  const filters = generateFilters(req);

  const { isPaginated, page, perPage } = req.query;
  const [products, totalData] = await receiveProducts(req, filters);
  convertImageIdsToArray(products);
  convertCategoriesToArray(products);

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
