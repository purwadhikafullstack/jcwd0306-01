const { Op } = require('sequelize');
const { UserAddress, Province, City } = require('../../models');

function generateFilters(req) {
  // set default values
  req.query.page = +req.query.page || 1;
  req.query.perPage = +req.query.perPage || 5;

  const { page, perPage } = req.query;

  return {
    limit: perPage,
    offset: (page - 1) * perPage,
  };
}

async function getCustomerAddress(req) {
  const { userId } = req.params;
  const { name } = req.query;
  const filters = generateFilters(req);

  const result = await UserAddress.findAll({
    ...filters,
    where: {
      userId,
      [Op.or]: [
        { district: { [Op.like]: `%${name || ''}%` } },
        { village: { [Op.like]: `%${name || ''}%` } },
        { addressName: { [Op.like]: `%${name || ''}%` } },
        { detail: { [Op.like]: `%${name || ''}%` } },
        { receiverName: { [Op.like]: `%${name || ''}%` } },
        { '$Province.name$': { [Op.like]: `%${name || ''}%` } },
        { '$City.name$': { [Op.like]: `%${name || ''}%` } },
      ],
    },
    include: [
      {
        model: Province,
        attributes: ['name'],
      },
      {
        model: City,
        attributes: ['name'],
      },
    ],
    order: [['isDefault', 'DESC']],
  });

  const totalData = (
    await UserAddress.findAll({
      ...filters,
      limit: undefined,
      offset: undefined,
      where: {
        userId,
        [Op.or]: [
          { district: { [Op.like]: `%${name || ''}%` } },
          { village: { [Op.like]: `%${name || ''}%` } },
          { addressName: { [Op.like]: `%${name || ''}%` } },
          { detail: { [Op.like]: `%${name || ''}%` } },
          { receiverName: { [Op.like]: `%${name || ''}%` } },
          { '$Province.name$': { [Op.like]: `%${name || ''}%` } },
          { '$City.name$': { [Op.like]: `%${name || ''}%` } },
        ],
      },
      include: [
        {
          model: Province,
          attributes: ['name'],
        },
        {
          model: City,
          attributes: ['name'],
        },
      ],
      order: [['isDefault', 'DESC']],
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

module.exports = getCustomerAddress;
