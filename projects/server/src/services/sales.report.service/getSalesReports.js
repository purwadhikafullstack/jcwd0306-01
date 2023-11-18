const { Op } = require('sequelize');
const {
  Order,
  UserAddress,
  City,
  Warehouse,
  WarehouseAddress,
} = require('../../models');

function generateFilters(req) {
  req.query.page = +req.query.page || 1;
  req.query.perPage = +req.query.perPage || 10;

  const { page, perPage } = req.query;

  return {
    limit: perPage,
    offset: (page - 1) * perPage,
  };
}

async function getSalesReports(req) {
  const { name } = req.query;
  const filters = generateFilters(req);

  const result = await Order.findAll({
    ...filters,
    where: {
      status: 'received',
      [Op.or]: [
        {
          '$Warehouse.WarehouseAddress.City.name$': {
            [Op.like]: `%${name || ''}%`,
          },
        },
        {
          '$UserAddress.City.name$': {
            [Op.like]: `%${name || ''}%`,
          },
        },
      ],
    },
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
  });

  const totalData = (
    await Order.findAll({
      ...filters,
      limit: undefined,
      offset: undefined,
      where: {
        status: 'received',
        [Op.or]: [
          {
            '$Warehouse.WarehouseAddress.City.name$': {
              [Op.like]: `%${name || ''}%`,
            },
          },
          {
            '$UserAddress.City.name$': {
              [Op.like]: `%${name || ''}%`,
            },
          },
        ],
      },
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
    })
  ).length;

  const paginationInfo = { totalData };

  paginationInfo.currentPage = +req.query.page;
  paginationInfo.perPage = +req.query.perPage;
  paginationInfo.totalPage = Math.ceil(
    paginationInfo.totalData / +req.query.perPage
  );
  paginationInfo.offset = filters.offset;

  return { data: { result, paginationInfo } };
}

module.exports = getSalesReports;
