const { orderService } = require('../services');
const { sendResponse } = require('../utils');

class OrderController {
  static getByID = async (req, res) => {
    try {
      const result = await orderService.getByID(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getOrderByUserId = async (req, res) => {
    try {
      const result = await orderService.getOrderByUserId(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getByQuery = async (req, res) => {
    try {
      const result = await orderService.getByQuery(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static createNewTransaction = async (req, res) => {
    try {
      const result = await orderService.createNewTransaction(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static uploadPaymentProof = async (req, res) => {
    try {
      const result = await orderService.uploadPaymentProof(req);
      global?.io.emit(`warehouse-${req.body.warehouseId}`, {
        message: `New transaction payment to be verified`,
      });
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static renderPaymentProof = async (req, res) => {
    try {
      const result = await orderService.renderPaymentProofImg(req);
      res.set('Content-type', 'image/png');
      return res.send(result?.paymentProof);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static userUpdateOrder = async (req, res) => {
    try {
      await orderService.update(req);
      return res.send('success');
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static adminUpdateOrder = async (req, res) => {
    try {
      const { status } = req.body;
      await orderService.adminUpdateOrder(req);
      if (status === 'unpaid')
        global?.io.emit(`unpaid-${req.baseData.userId}`, {
          message: 'You need to review one of transaction',
          data: req.baseData,
        });
      else
        global?.io.emit(`notification-${req.baseData.userId}`, {
          key: status,
          value: 1,
        });

      res.send('success');
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static updateOrderStatus = async (req, res) => {
    try {
      await orderService.updateOrderStatus(req);
      const { status } = req.body;
      if (status === 'unpaid') {
        global?.io.emit(`unpaid-${req.body.userId}`, {
          message: 'You need to review one of transaction',
          data: req.body,
        });
      } else {
        global?.io.emit(`notification-${req.body.userId}`, {
          key: status,
          value: 1,
        });
      }
      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  };
}

module.exports = OrderController;
