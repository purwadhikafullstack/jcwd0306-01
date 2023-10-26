const { OrderService } = require('../services');
const { sendResponse } = require('../utils');

class OrderController {
  static getByID = async (req, res) => {
    try {
      const result = await OrderService.getByID(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static createNewTransaction = async (req, res) => {
    try {
      const result = await OrderService.createNewTransaction(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static uploadPaymentProof = async (req, res) => {
    try {
      const result = await OrderService.uploadPaymentProof(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static renderPaymentProof = async (req, res) => {
    try {
      const result = await OrderService.renderPaymentProofImg(req);
      res.set('Content-type', 'image/png');
      return res.send(result?.paymentProof);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = OrderController;
