const { Op } = require('sequelize');
const db = require('../../models');
const Service = require('../baseServices');
const { ResponseError } = require('../../errors');

class Order extends Service {
  limit = 7;

  optionGetOrderByUserId = (page, userId, name) => ({
    limit: this.limit,
    offset: page ? (Number(page) - 1) * this.limit : 0,
    where: {
      userId,
      ...(name && { '$Product.name$': { [Op.like]: `%${name}%` } }),
    },
    include: [
      {
        model: db.OrderProduct,
        include: [
          {
            model: db.Product,
            include: { model: db.ProductImage, attributes: ['id'] },
          },
        ],
      },
    ],
  });

  getOrderByUserId = async (req) => {
    try {
      const userId = Number(req.params.userId);
      const { name, page } = req.query;
      const result = await this.getByUserId(
        req,
        this.optionGetOrderByUserId(page, userId, name)
      );
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };

  getByQuery = async (req) => {
    const { page, productName } = req.query;
    const limit = 7;
    try {
      await this.db.findAndCountAll({
        logging: false,
        limit,
        offset: page ? (Number(page) - 1) * limit : 0,
        where: { ...(productName && { productName }) },
        include: [db.OrderProduct],
      });
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };

  createNewTransaction = async (req) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const newTransaction = await this.create(req.body, { transaction: t });
      });
      return req.body;
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };
}

module.exports = new Order('Order');
