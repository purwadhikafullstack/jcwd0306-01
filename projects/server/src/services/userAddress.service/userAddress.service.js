const Service = require('../baseServices');
const db = require('../../models');

const optiongetAddressByUserId = {
  include: [
    { model: db.Province, attributes: ['name'] },
    { model: db.City, attributes: ['name'] },
  ],
};
class UserAddress extends Service {
  getAddressByUserId = async (req) =>
    this.getByUserId(req, optiongetAddressByUserId);
}

module.exports = new UserAddress('UserAddress');
