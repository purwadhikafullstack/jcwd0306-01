const { Op } = require('sequelize');
const { StockHistory, Product, Warehouse, User } = require('../../models');

function generateFilters(req) {
  req.query.page = +req.query.page || 1;
  req.query.perPage = +req.query.perPage || 10;

  const { sortBy, orderBy, page, perPage } = req.query;

  let order = [];
  if (sortBy === 'date') order = [['createdAt', orderBy]];
  else if (sortBy === 'type') order = [['type', orderBy]];
  else if (sortBy === 'updatedStock') order = [['updatedStock', orderBy]];
  else if (sortBy === 'quantity') order = [['quantity', orderBy]];
  else if (sortBy === 'warehouse') order = [[Warehouse, 'name', orderBy]];
  else if (sortBy === 'productName') order = [[Product, 'name', orderBy]];
  else if (sortBy === 'adminName') order = [[User, 'firstName', orderBy]];

  return {
    order,
    limit: perPage,
    offset: (page - 1) * perPage,
  };
}

async function getProductHistory(req) {
  const { name, WH, productName, startDate, endDate } = req.query;
  const filters = generateFilters(req);

  const whereClause = {
    [Op.or]: [
      { type: { [Op.like]: `%${name || ''}%` } },
      { '$Warehouse.name$': { [Op.like]: `%${name || ''}%` } },
      { '$Product.name$': { [Op.like]: `%${name || ''}%` } },
      { '$User.firstName$': { [Op.like]: `%${name || ''}%` } },
    ],
    [Op.and]: [
      startDate && {
        createdAt: {
          [Op.between]: [
            new Date(`${startDate}T00:00:00.000+07:00`),
            new Date(`${endDate}T23:59:59.999+07:00`),
          ],
        },
      },
      { '$Warehouse.name$': { [Op.like]: `%${WH || ''}%` } },
      { '$Product.name$': { [Op.like]: `%${productName || ''}%` } },
    ],
  };

  const data = await StockHistory.findAll({
    where: whereClause,
    ...filters,
    attributes: [
      'id',
      'warehouseId',
      'productId',
      'quantity',
      'updatedStock',
      'type',
      'adminId',
      'stockMutationId',
      'orderId',
      'createdAt',
      'updatedAt',
    ],
    include: [
      {
        model: Product,
        attributes: ['name'],
      },
      {
        model: Warehouse,
        attributes: ['name'],
      },
      {
        model: User,
        attributes: ['firstName', 'lastName'],
      },
    ],
  });

  const totalData = await StockHistory.findAll({
    where: whereClause,
    ...filters,
    limit: undefined,
    offset: undefined,
    include: [
      {
        model: Product,
        attributes: ['name'],
      },
      {
        model: Warehouse,
        attributes: ['name'],
      },
      {
        model: User,
        attributes: ['firstName', 'lastName'],
      },
    ],
  });

  const paginationInfo = {
    totalData: totalData.length,
    currentPage: +req.query.page,
    perPage: +req.query.perPage,
    totalPage: Math.ceil(totalData.length / +req.query.perPage),
  };
  return [data, paginationInfo];
}

module.exports = getProductHistory;
