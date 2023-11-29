const { Op } = require('sequelize');
const db = require('../../models');

const optionGetAddressByUserId = (name, userId) => ({
  where: {
    userId,
    [Op.or]: [
      { '$Province.name$': { [Op.like]: `%${name}%` } },
      { '$City.name$': { [Op.like]: `%${name}%` } },
      { addressName: { [Op.like]: `%${name}%` } },
      { receiverName: { [Op.like]: `%${name}%` } },
      { district: { [Op.like]: `%${name}%` } },
      { village: { [Op.like]: `%${name}%` } },
      { detail: { [Op.like]: `%${name}%` } },
    ],
  },
  limit: 20,
  include: [
    { model: db.Province, attributes: ['name'] },
    { model: db.City, attributes: ['name'] },
  ],
});

module.exports = optionGetAddressByUserId;
