const { sequelize, Sequelize, Category } = require('../../models');

const TOTALPRODUCTS_QUERY = sequelize.literal(
  `CAST(( 
    SELECT COUNT(*) 
    FROM ProductCategories AS pc 
    WHERE pc.categoryId = Category.id 
    ) AS SIGNED 
  )`
);

function generateFilters(req) {
  // set default values
  if (typeof req.query.pagination !== 'boolean') req.query.pagination = false;
  req.query.sortBy = req.query.sortBy || 'updatedAt';
  req.query.orderBy = req.query.orderBy || 'DESC';
  req.query.page = req.query.page || 1;
  req.query.perPage = req.query.perPage || 10;

  // query for sort by totalProducts
  if (req.query.sortBy === 'totalProducts' && !req.query.warehouseId)
    req.query.sortBy = TOTALPRODUCTS_QUERY;

  const { search, sortBy, orderBy, pagination, page, perPage } = req.query;
  return {
    logging: false,
    attributes: {
      include: [[TOTALPRODUCTS_QUERY, 'totalProducts']],
      exclude: ['image'],
    },
    where: { name: { [Sequelize.Op.like]: `%${search || ''}%` } },
    order: [[sortBy, orderBy]],
    limit: pagination ? perPage : undefined,
    offset: pagination ? (page - 1) * perPage : undefined,
  };
}

async function receiveCategories(req, filters) {
  const totalData = (
    await Category.findAll({ ...filters, limit: undefined, offset: undefined })
  ).length;
  const categories = await Category.findAll({ ...filters });
  return [categories, totalData];
}

async function getCategories(req) {
  const filters = generateFilters(req);
  const [categories, totalData] = await receiveCategories(req, filters);

  const { pagination, page, perPage } = req.query;
  const paginationInfo = { totalData };
  if (pagination) {
    paginationInfo.currentPage = page;
    paginationInfo.perPage = perPage;
    paginationInfo.totalPage = Math.ceil(paginationInfo.totalData / perPage);
    paginationInfo.offset = filters.offset;
  }

  return [categories, paginationInfo];
}

module.exports = getCategories;
