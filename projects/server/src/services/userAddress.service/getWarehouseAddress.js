const { ResponseError } = require('../../errors');
const db = require('../../models');

const getWarehouseAddress = async () => {
  try {
    const result = await db.WarehouseAddress.findAll({ logging: false });
    const temp = [];
    for (let i = 0; i < result.length; i += 1) {
      temp.push(result[i].dataValues);
    }
    return temp;
  } catch (error) {
    throw new ResponseError(error?.message);
  }
};

module.exports = { getWarehouseAddress };
