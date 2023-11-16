const {
  Sequelize,
  StockMutation,
  Product,
  Order,
  Warehouse,
} = require('../../models');

function generateFilters(req) {
  // set default values
  req.query.sortBy = req.query.sortBy || 'updatedAt';
  req.query.orderBy = req.query.orderBy || 'DESC';
  req.query.page = req.query.page || 1;
  req.query.perPage = req.query.perPage || 10;

  const { search, warehouseId, status, type, sortBy, orderBy, page, perPage } =
    req.query;

  // set where
  const where = {};
  if (warehouseId)
    where[Sequelize.Op.or] = {
      fromWarehouseId: warehouseId,
      toWarehouseId: warehouseId,
    };
  if (status) where.status = status;
  if (type) where.type = type;

  //   set order
  let order = [[sortBy, orderBy]];
  if (sortBy === 'product-name') order = [[Product, 'name', orderBy]];
  else if (sortBy === 'from-wh-name')
    order = [[{ model: Warehouse, as: 'fromWarehouse' }, 'name', orderBy]];
  else if (sortBy === 'to-wh-name')
    order = [[{ model: Warehouse, as: 'toWarehouse' }, 'name', orderBy]];

  return {
    where,
    order,
    limit: perPage,
    offset: (page - 1) * perPage,
    include: [
      {
        model: Product,
        paranoid: false,
        where: search
          ? { name: { [Sequelize.Op.like]: `%${search}%` } }
          : undefined,
      },
      { model: Warehouse, paranoid: false, as: 'fromWarehouse' },
      { model: Warehouse, paranoid: false, as: 'toWarehouse' },
      { model: Order },
    ],
  };
}

async function getStockMutations(req) {
  const filters = generateFilters(req);
  const totalData = (
    await StockMutation.findAll({
      ...filters,
      limit: undefined,
      offset: undefined,
    })
  ).length;
  const stockMutations = await StockMutation.findAll({ ...filters });

  const { page, perPage } = req.query;
  const paginationInfo = {
    totalData,
    currentPage: page,
    perPage,
    totalPage: Math.ceil(totalData / perPage),
    offset: filters.offset,
  };

  return [stockMutations, paginationInfo];
}

module.exports = getStockMutations;
