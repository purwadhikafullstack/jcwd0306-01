const Joi = require('joi');
const { sendResponse, validateJoiSchema } = require('../../utils');
const { ResponseError } = require('../../errors');
const { orderService } = require('../../services');
const db = require('../../models');
const includeOrderProductAndWarehouseProduct = require('./order/includeProductAndWhsProduct');

const checkQuantityToStock = (dataValues = {}) => {
  dataValues.OrderProducts.forEach((val) => {
    if (val.dataValues.quantity > val.dataValues.stock)
      throw new ResponseError(
        `${val.dataValues.Product.dataValues.name} request quantity exceeds stock`,
        400
      );
  });
};

const checkCondition = (
  dataValues = {},
  status = '',
  shippmentReceipt = ''
) => {
  if (!dataValues) throw new Error('Order not found');

  if (
    dataValues.status !== 'verifying' &&
    (status === 'unpaid' || status === 'processed')
  )
    throw new ResponseError(
      `Cannot change status to ${status} in this stage`,
      400
    );

  checkQuantityToStock(dataValues);

  if (status === 'shipped' && !shippmentReceipt)
    throw new ResponseError(`No shipment receipt`);
};

const orderValidator = {
  checkStatus: async (req, res, next) => {
    try {
      const order = await orderService.getByID(req);
      if (order.status !== 'unpaid' && req.body.status === 'cancel')
        throw new ResponseError(
          'User cannot cancel this order on this stage',
          400
        );
      return next();
    } catch (error) {
      return sendResponse({ res, error });
    }
  },

  rejectOrConfirm: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, shippmentReceipt, adminId } = req.body;
      const { dataValues } = await db.Order.findOne({
        where: { id },
        logging: false,
        attributes: ['id', 'status'],
        include: [includeOrderProductAndWarehouseProduct],
      });
      checkCondition(dataValues, status, shippmentReceipt);
      req.baseData = req.body;
      req.order = dataValues;
      req.baseData.status = status;
      req.body = { status, shippmentReceipt, adminId, isReadByUser: false };
      return next();
    } catch (error) {
      return sendResponse({ res, error });
    }
  },

  updateOrderStatus: (req, res, next) => {
    try {
      validateJoiSchema(
        req.params,
        Joi.object({
          id: Joi.number().integer().min(1).required(),
        }).required()
      );
      validateJoiSchema(
        req.body,
        Joi.object({
          status: Joi.string()
            .valid('unpaid', 'rejected', 'processed', 'shipped', 'received')
            .required(),
        }).unknown()
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = orderValidator;
