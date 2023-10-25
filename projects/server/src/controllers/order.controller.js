const { OrderService } = require('../services');
const { sendResponse } = require('../utils');

class OrderController {
  static createNewTransaction = async (req, res) => {
    try {
      const result = await OrderService.createNewTransaction(req);
      return res.send(result);
    } catch (error) {
      sendResponse({ res, error });
    }
  };
}

module.exports = OrderController;
