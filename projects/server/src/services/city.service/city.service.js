const { Op } = require('sequelize');
const Service = require('../baseServices');

const optionGetAll = (name, provinceId) => ({
  // limit: 7,
  where: {
    ...(name && { name: { [Op.like]: `%${name}%` } }),
    ...(provinceId && { provinceId }),
  },
  logging: false,
});

class City extends Service {
  getCities = async (req) => {
    const { name, provinceId } = req.query;
    const option = optionGetAll(name, provinceId);
    try {
      const result = await this.getAll(option);
      return result;
    } catch (error) {
      throw new Error(error?.message);
    }
  };
}

module.exports = new City('City');
