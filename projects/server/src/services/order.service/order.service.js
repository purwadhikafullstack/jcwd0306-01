/* eslint-disable no-await-in-loop */
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const db = require('../../models');
const Service = require('../baseServices');
const { ResponseError } = require('../../errors');
const includeOrderProduct = require('./includeOrderProduct');
const includeUserAddress = require('./includeUserAddress');
const optionGetOrderByUserId = require('./optionGetOrderByUserId');
const optionGetByQuery = require('./optionGetByQuery');
const { findNearbyWarehouse } = require('./findNearbyWarehouse');
const { doStockMutation } = require('./doStockMutation');
const doDecrementStock = require('./doDecrementStock');
const updateOrderStatusUnpaid = require('./updateOrderStatusUnpaid');
const updateOrderStatusRejected = require('./updateOrderStatusRejected');
const updateOrderStatusProcessed = require('./updateOrderStatusProcessed');
const updateOrderStatusShipped = require('./updateOrderStatusShipped');
const updateOrderStatusReceived = require('./updateOrderStatusReceived');
const updateOrderStatusOption = require('./updateOrderStatusOption');

class Order extends Service {
  optionGetByID = {
    include: [includeOrderProduct, includeUserAddress],
  };

  getByID = async (req) => {
    const { dataValues } = await this.getOneByID(req, this.optionGetByID);
    return this.encryptID(dataValues);
  };

  getOrderByUserId = async (req) => {
    try {
      const userId = Number(req.params.userId);
      const { name, page, status } = req.query;
      const limit = 7;
      const result = await this.getByUserId(
        req,
        optionGetOrderByUserId(page, userId, limit, name, status, [
          includeOrderProduct,
          includeUserAddress,
        ])
      );
      return this.encryptMultiResult(result);
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };

  // untuk admin
  getByQuery = async (req) => {
    const { page, text, id, status, warehouseId } = req.query;
    const limit = Number(req.query.limit) || 0;
    try {
      const result = await this.db.findAndCountAll(
        optionGetByQuery(limit, page, text, id, status, warehouseId)
      );
      result.number_of_pages = limit
        ? Math.ceil(result.count / Number(limit))
        : 1;
      return result;
    } catch (error) {
      throw new ResponseError(error?.message, 500);
    }
  };

  static orderProductFormatter = (products, orderId) => {
    const temp = [];
    products.forEach((product) => {
      const { price, discount } = product.Product;
      temp.push({
        ...product,
        price: price - price * discount,
        orderId,
      });
    });
    return temp;
  };

  createNewTransaction = async (req) => {
    try {
      req.body.invoiceId = uuidv4();
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

  adminUpdateOrder = async (req) => {
    const { OrderProducts } = req.order;
    const { warehouseId } = req.baseData;
    if (req.body.status === 'processed')
      await db.sequelize.transaction(async (t) => {
        for (let i = 0; i < OrderProducts.length; i += 1) {
          const { quantity, productId } = OrderProducts[i];
          const warehouses = OrderProducts[i].Product.WarehouseProducts;
          const idx = warehouses.findIndex(
            (whse) => whse.dataValues.warehouseId === warehouseId
          );
          const currStock = warehouses[idx]?.stock;
          const tempWhse = warehouses.filter(
            (whs) => whs.dataValues.stock > quantity
          ); // get warehouse which has greater stock
          const source = tempWhse.length ? tempWhse : warehouses; // if no warehouse with greater stock, decrease from several nearby warehouse
          if (idx === -1 || currStock < quantity) {
            const nearbyWhse = await findNearbyWarehouse(warehouseId, source);
            const neededStock = currStock ? quantity - currStock : quantity;
            await doStockMutation(t, warehouseId, nearbyWhse, neededStock);
          }
          await doDecrementStock(t, quantity, warehouseId, productId);
        }
        await this.update(req, { transaction: t });
      });
    else {
      await this.update(req);
    }
    return 'success';
  };

  updateOrderStatus = async (req) => {
    await db.sequelize.transaction(
      {
        isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async (t) => {
        const order = await this.db.findByPk(req.params.id, {
          transaction: t,
          ...updateOrderStatusOption,
        });
        if (!order) throw new ResponseError('Order not found', 404);
        const { status } = req.body;
        if (status === 'unpaid') {
          await updateOrderStatusUnpaid(req, order, t);
        } else if (status === 'rejected') {
          await updateOrderStatusRejected(req, order, t);
        } else if (status === 'processed') {
          await updateOrderStatusProcessed(req, order, t);
        } else if (status === 'shipped') {
          await updateOrderStatusShipped(req, order, t);
        } else if (status === 'received') {
          await updateOrderStatusReceived(req, order, t);
        }
      }
    );
  };

  updateOrderStatusByUser = async (req) => {
    const order = await this.db.findByPk(req.params.id);
    if (!order) throw new Error('order not found!', 404);
    if (order.userId !== req.user.id) throw new Error('User Unauthorized', 401);
    await order.update({ status: 'received' });
  };
}

module.exports = new Order('Order');
