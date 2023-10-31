const { Op } = require('sequelize');
const Service = require('../baseServices');

class Province extends Service {
  static optionGetAll = (name) => ({
    where: { ...(name && { name: { [Op.like]: `%${name}%` } }) },
    logging: false,
  });

  getProvinces = async (req) => {
    const { name } = req.query;
    const option = Province.optionGetAll(name);
    const result = await this.getAll(option);
    return result;
  };
}

module.exports = new Province('Province');
