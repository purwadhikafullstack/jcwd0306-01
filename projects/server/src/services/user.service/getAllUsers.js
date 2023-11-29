const { Op } = require('sequelize');
const { User } = require('../../models');

function generateFilters(req) {
  // set default values
  req.query.page = +req.query.page || 1;
  req.query.perPage = +req.query.perPage || 10;

  const { sortBy, orderBy, page, perPage } = req.query;
  let order = [];
  if (sortBy === 'firstName') order = [['firstName', orderBy]];
  else if (sortBy === 'lastName') order = [['lastName', orderBy]];
  else if (sortBy === 'email') order = [['email', orderBy]];
  else if (sortBy === 'joinDate') order = [['updatedAt', orderBy]];
  return {
    order,
    limit: perPage,
    offset: (page - 1) * perPage,
  };
}

async function getAllUsers(req) {
  const { name } = req.query;
  const filters = generateFilters(req);

  const result = await User.findAll({
    ...filters,
    attributes: { exclude: ['image', 'password'] },
    where: {
      [Op.or]: [
        { firstName: { [Op.like]: `%${name || ''}%` } },
        { lastName: { [Op.like]: `%${name || ''}%` } },
      ],
    },
  });

  const users = await User.findAll({
    ...filters,
    limit: undefined,
    offset: undefined,
    attributes: { exclude: ['image', 'password'] },
    where: {
      [Op.or]: [
        { firstName: { [Op.like]: `%${name || ''}%` } },
        { lastName: { [Op.like]: `%${name || ''}%` } },
      ],
    },
  });

  const totalData = users.length;

  const paginationInfo = { totalData };

  paginationInfo.currentPage = +req.query.page;
  paginationInfo.perPage = +req.query.perPage;
  paginationInfo.totalPage = Math.ceil(
    paginationInfo.totalData / +req.query.perPage
  );
  paginationInfo.offset = filters.offset;
  paginationInfo.totalUsers = users.length;

  return [result, paginationInfo];
}

module.exports = getAllUsers;
