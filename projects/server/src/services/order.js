const { sequelize } = require('../models');
const db = require('../models');
const Service = require('./baseServices');

class Order extends Service {
  getByQuery = async (req) => {
    const { page, productName } = req.query;
    const limit = 7;

    await this.db.findAndCountAll({
      logging: false,
      limit,
      offset: page ? (Number(page) - 1) * limit : 0,
      // where: { ...(productName && { productName }) },
      include: [db.OrderProduct],
    });
  };
}

module.exports = new Order('Order');
