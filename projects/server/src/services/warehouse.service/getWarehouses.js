const {
  Sequelize,
  Warehouse,
  WarehouseAddress,
  Province,
  City,
} = require('../../models');

function generateFilters(req) {
  // set default values
  if (typeof req.query.pagination !== 'boolean') req.query.pagination = false;
  req.query.sortBy = req.query.sortBy || 'updatedAt';
  req.query.orderBy = req.query.orderBy || 'DESC';
  req.query.page = req.query.page || 1;
  req.query.perPage = req.query.perPage || 10;

  const { search, sortBy, orderBy, pagination, page, perPage } = req.query;
  return {
    logging: false,
    where: {
      [Sequelize.Op.or]: {
        name: { [Sequelize.Op.like]: `%${search || ''}%` },
        '$WarehouseAddress.Province.name$': {
          [Sequelize.Op.like]: `%${search || ''}%`,
        },
        '$WarehouseAddress.City.name$': {
          [Sequelize.Op.like]: `%${search || ''}%`,
        },
      },
    },
    order: [[sortBy, orderBy]],
    limit: pagination ? perPage : undefined,
    offset: pagination ? (page - 1) * perPage : undefined,
    paranoid: false,
    include: [
      {
        model: WarehouseAddress,
        include: [{ model: Province }, { model: City }],
        paranoid: false,
      },
    ],
  };
}

async function receiveWarehouses(req, filters) {
  const totalData = (
    await Warehouse.findAll({ ...filters, limit: undefined, offset: undefined })
  ).length;
  const categories = await Warehouse.findAll({ ...filters });
  return [categories, totalData];
}

async function getWarehouses(req) {
  const filters = generateFilters(req);
  const [categories, totalData] = await receiveWarehouses(req, filters);

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

module.exports = getWarehouses;
