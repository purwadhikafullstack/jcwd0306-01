const db = require('../../models');

const includeUserAddress = {
  model: db.UserAddress,
  attributes: {
    exclude: ['updatedAt', 'createdAt', 'longitude', 'latitude', 'isDefault'],
  },
  include: [
    { model: db.City, attributes: ['name'] },
    { model: db.Province, attributes: ['name'] },
  ],
};

module.exports = includeUserAddress;
