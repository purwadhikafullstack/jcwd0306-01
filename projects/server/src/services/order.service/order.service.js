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

  static orderProductFormatter = (products, orderId) => {
    const temp = [];
    products.forEach((product) =>
      temp.push({
        ...product,
        price: product.Product.price,
        orderId,
      })
    );
    return temp;
  };

  createNewTransaction = async (req) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const newTransaction = await this.db.create(req.body, {
          transaction: t,
        });
        const orderProducts = Order.orderProductFormatter(
          req.body.products,
          newTransaction.dataValues.id
        );
        await db.OrderProduct.bulkCreate(orderProducts, {
          logging: false,
          transaction: t,
        });
      });
      return req.body;
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };

  static paymentProof = (req) => req.body;
}

module.exports = new Order('Order');
