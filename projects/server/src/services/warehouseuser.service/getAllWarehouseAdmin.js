const { Op } = require('sequelize');
const { ResponseError } = require('../../errors');
const {
  WarehouseUser,
  User,
  Warehouse,
  WarehouseAddress,
  Province,
} = require('../../models');

function generateFilters(req) {
  // set default values
  req.query.page = +req.query.page || 1;
  req.query.perPage = +req.query.perPage || 10;

  const { sortBy, orderBy, page, perPage } = req.query;
  let order = [];
  if (sortBy === 'name') order = [[User, 'firstName', orderBy]];
  else if (sortBy === 'email') order = [[User, 'email', orderBy]];
  else if (sortBy === 'warehouseName') order = [[Warehouse, 'name', orderBy]];
  else if (sortBy === 'warehouseLoc')
    order = [[Warehouse, WarehouseAddress, Province, 'name', orderBy]];
  return {
    order,
    limit: perPage,
    offset: (page - 1) * perPage,
  };
}

async function getAllWarehouseAdmin(req) {
  const { name } = req.query;
  const filters = generateFilters(req);

  const result = await WarehouseUser.findAll({
    ...filters,
    include: [
      {
        model: User,
        attributes: ['firstName', 'email', 'id'],
      },
      {
        model: Warehouse,
        attributes: ['name'],
        include: [
          {
            model: WarehouseAddress,
            attributes: ['provinceId'],
            include: [
              {
                model: Province,
                attributes: ['name'],
              },
            ],
          },
        ],
      },
    ],
    where: {
      [Op.or]: [
        { '$User.firstName$': { [Op.like]: `%${name || ''}%` } },
        { '$User.lastName$': { [Op.like]: `%${name || ''}%` } },
        { '$Warehouse.name$': { [Op.like]: `%${name || ''}%` } },
        {
          '$Warehouse.WarehouseAddress.Province.name$': {
            [Op.like]: `%${name || ''}%`,
          },
        },
      ],
    },
  });
  if (!result) throw new ResponseError('warehouse admin not found', 404);

  const totalData = (
    await WarehouseUser.findAll({
      ...filters,
      limit: undefined,
      offset: undefined,
      include: [
        {
          model: User,
          attributes: ['firstName', 'email', 'id'],
          where: {
            [Op.or]: [
              { firstName: { [Op.like]: `%${name || ''}%` } },
              { lastName: { [Op.like]: `%${name || ''}%` } },
            ],
          },
        },
        {
          model: Warehouse,
          attributes: ['name'],
          include: [
            {
              model: WarehouseAddress,
              attributes: ['provinceId'],
              include: [
                {
                  model: Province,
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
      where: {
        [Op.or]: [
          { '$User.firstName$': { [Op.like]: `%${name || ''}%` } },
          { '$User.lastName$': { [Op.like]: `%${name || ''}%` } },
          { '$Warehouse.name$': { [Op.like]: `%${name || ''}%` } },
          {
            '$Warehouse.WarehouseAddress.Province.name$': {
              [Op.like]: `%${name || ''}%`,
            },
          },
        ],
      },
    })
  ).length;

  const paginationInfo = { totalData };

  paginationInfo.currentPage = +req.query.page;
  paginationInfo.perPage = +req.query.perPage;
  paginationInfo.totalPage = Math.ceil(
    paginationInfo.totalData / +req.query.perPage
  );
  paginationInfo.offset = filters.offset;

  return [result, paginationInfo];
}

module.exports = getAllWarehouseAdmin;
