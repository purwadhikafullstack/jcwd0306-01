const { Op } = require('sequelize');
const {
  Order,
  UserAddress,
  City,
  Warehouse,
  WarehouseAddress,
  OrderProduct,
  Product,
  Category,
} = require('../../models');

function generateFilters(req) {
  req.query.page = +req.query.page || 1;
  req.query.perPage = +req.query.perPage || 10;

  const { sortBy, orderBy, page, perPage } = req.query;

  let order = [];
  if (sortBy === 'date') order = [['createdAt', orderBy]];
  else if (sortBy === 'id') order = [['id', orderBy]];
  else if (sortBy === 'total') order = [['total', orderBy]];
  else if (sortBy === 'warehouseLoc')
    order = [[Warehouse, WarehouseAddress, City, 'name', orderBy]];
  else if (sortBy === 'sentTo') order = [[UserAddress, City, 'name', orderBy]];

  return {
    order,
    limit: perPage,
    offset: (page - 1) * perPage,
  };
}

async function getSalesReports(req) {
  const { name, WH, category, productName, startDate, endDate, warehouseId } =
    req.query;
  const filters = generateFilters(req);
  const numberedWhId = Number(warehouseId);
  console.log(numberedWhId);

  const whereClause = {
    status: 'received',
    [Op.and]: [
      WH && {
        '$Warehouse.name$': { [Op.like]: `%${WH || ''}%` },
      },
      startDate && {
        createdAt: {
          [Op.between]: [
            new Date(`${startDate}T00:00:00.000+07:00`),
            new Date(`${endDate}T23:59:59.999+07:00`),
          ],
        },
      },
      numberedWhId && { warehouseId: numberedWhId },
    ],
    [Op.or]: [
      {
        '$UserAddress.City.name$': { [Op.like]: `%${name || ''}%` },
      },
      {
        '$Warehouse.WarehouseAddress.City.name$': {
          [Op.like]: `%${name || ''}%`,
        },
      },
    ],
  };

  const result = await Order.findAll({
    where: whereClause,
    ...filters,
    attributes: ['id', 'total', 'createdAt'],
    include: [
      {
        model: UserAddress,
        attributes: ['cityId'],
        include: [
          {
            model: City,
            attributes: ['name'],
          },
        ],
      },
      {
        model: Warehouse,
        attributes: ['name'],
        include: [
          {
            model: WarehouseAddress,
            attributes: ['cityId'],
            include: {
              model: City,
              attributes: ['name'],
            },
          },
        ],
      },
    ],
    logging: false,
  });

  const orderIds = result.map((order) => order.id);

  /* ORDER PRODUCT */
  const orderProducts = await OrderProduct.findAll({
    where: {
      orderId: {
        [Op.in]: orderIds,
      },
      '$Product.name$': {
        [Op.like]: `%${productName || ''}%`,
      },
    },
    attributes: ['quantity', 'orderId', 'productId'],
    // new
    include: [
      {
        model: Product,
        attributes: ['name'],
        include: [
          {
            model: Category,
            attributes: ['name'],
            through: { attributes: [] },
            where: {
              name: { [Op.like]: `%${category || ''}%` },
            },
          },
        ],
      },
    ],
    logging: false,
  });

  // Associate OrderProducts with Orders
  result.forEach((order) => {
    const associatedOrderProducts = orderProducts.filter(
      (op) => op.orderId === order.id
    );

    associatedOrderProducts.forEach((op) => {
      op.setDataValue('Product', op.Product);
    });
    order.setDataValue('OrderProducts', associatedOrderProducts);
  });

  /* TOTAL DATA */
  const totalData = await Order.findAll({
    ...filters,
    limit: undefined,
    offset: undefined,
    where: whereClause,
    attributes: ['id', 'total', 'createdAt', 'invoiceId'],
    include: [
      {
        model: UserAddress,
        attributes: ['cityId'],
        include: [
          {
            model: City,
            attributes: ['name'],
          },
        ],
      },
      {
        model: Warehouse,
        attributes: ['name'],
        include: [
          {
            model: WarehouseAddress,
            attributes: ['cityId'],
            include: { model: City, attributes: ['name'] },
          },
        ],
      },
    ],
    logging: false,
  });

  const paginationInfo = {
    totalData: totalData.length,
    currentPage: +req.query.page,
    perPage: +req.query.perPage,
    totalPage: Math.ceil(totalData.length / +req.query.perPage),
    offset: filters.offset,
    grandTotal: totalData.reduce((val, curr) => val + curr.total, 0),
  };

  return { data: { result, paginationInfo } };
}

module.exports = getSalesReports;
