const { Op } = require('sequelize');
const Service = require('../baseServices');

class City extends Service {
  static optionGetAll = (name, provinceId) => ({
    where: {
      ...(name && { name: { [Op.like]: `%${name}%` } }),
      ...(provinceId && { provinceId }),
    },
    logging: false,
  });

  getCities = async (req) => {
    const { name, provinceId } = req.query;
    const result = await this.getAll(City.optionGetAll(name, provinceId));
    return result;
  };
}

module.exports = new City('City');
