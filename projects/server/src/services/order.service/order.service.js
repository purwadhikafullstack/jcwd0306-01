const { Op } = require('sequelize');
const sharp = require('sharp');
const db = require('../../models');
const Service = require('../baseServices');
const { ResponseError } = require('../../errors');

class Order extends Service {
  limit = 7;

  optionGetOrderByUserId = (page, userId, name, status) => ({
    limit: this.limit,
    offset: page ? (Number(page) - 1) * this.limit : 0,
    order: [['createdAt', 'DESC']],
    required: true,
    where: {
      userId,
      ...(typeof status === 'string' && { status }),
      ...(typeof status === 'object' && { status: { [Op.in]: status } }),
      ...(name && {
        id: [
          db.sequelize.literal(
            `SELECT O.id from Orders AS O JOIN OrderProducts AS OP on O.id=OP.orderId JOIN Products as P on OP.productId = P.id where P.name like '%${name}%'`
          ),
        ],
      }),
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
      { model: db.UserAddress, include: [db.City, db.Province] },
    ],
  });

  optionGetByID = {
    include: {
      model: db.OrderProduct,
      include: {
        model: db.Product,
        include: { model: db.ProductImage, attribute: ['id'] },
      },
    },
  };

  getByID = async (req) => {
    const { dataValues } = await this.getOneByID(req, this.optionGetByID);
    return this.encryptID(dataValues);
  };

  getOrderByUserId = async (req) => {
    try {
      const userId = Number(req.params.userId);
      const { name, page, status } = req.query;
      const result = await this.getByUserId(
        req,
        this.optionGetOrderByUserId(page, userId, name, status)
      );
      return this.encryptMultiResult(result);
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };

  // untuk admin
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
      let newTransaction = {};
      await db.sequelize.transaction(async (t) => {
        newTransaction = await this.db.create(req.body, {
          transaction: t,
          logging: false,
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

      return this.encryptID(newTransaction.dataValues);
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };

  uploadPaymentProof = async (req) => {
    req.body.paymentProof = await sharp(req.file.buffer)
      .png()
      .resize(600, undefined, {
        withoutEnlargement: true,
        fastShrinkOnLoad: true,
      })
      .toBuffer();
    await this.update(req, { logging: false });
    return 'success';
  };

  renderPaymentProofImg = async (req) => {
    const result = await this.getByID(req);
    return result;
  };
}

module.exports = new Order('Order');
