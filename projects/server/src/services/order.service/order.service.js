const { Op } = require('sequelize');
const db = require('../../models');
const Service = require('../baseServices');

const limit = 7;

class Order extends Service {
  getOrderByUserId = async (req) => {
    const userId = Number(req.params.userId);
    const { name, page } = req.query;
    const optionGetOrderByUserId = {
      limit,
      offset: page ? (Number(page) - 1) * limit : 0,
      where: {
        userId,
        ...(name && { '$Product.name$': { [Op.like]: `%${name}%` } }),
      },
      include: db.Product,
    };
    const result = await this.getByUserId(req, optionGetOrderByUserId);
    return result;
  };

  getByQuery = async (req) => {
    const { page, productName } = req.query;
    const limit = 7;
    try {
      await this.db.findAndCountAll({
        logging: false,
        limit,
        offset: page ? (Number(page) - 1) * limit : 0,
        // where: { ...(productName && { productName }) },
        include: [db.OrderProduct],
      });
    } catch (err) {
      throw new Error(err?.message);
    }
  };
}

module.exports = new Order('Order');
