const { Op } = require('sequelize');
const Service = require('../baseServices');

const optionGetAll = (name) => ({
  limit: 7,
  where: { ...(name && { name: { [Op.like]: `%${name}%` } }) },
  logging: false,
});

class City extends Service {
  getCities = async (req) => {
    const { name } = req.query;
    const option = optionGetAll(name);
    try {
      const result = await this.getAll(option);
      return result;
    } catch (error) {
      throw new Error(error?.message);
    }
  };
}

module.exports = new City('City');
