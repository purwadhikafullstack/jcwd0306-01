const { sendResponse } = require('../../utils');
const { ResponseError } = require('../../errors');
const { OrderService } = require('../../services');

const orderValidator = {
  checkStatus: async (req, res, next) => {
    try {
      const order = await OrderService.getByID(req);
      if (order.status !== 'unpaid')
        throw new ResponseError('Cannot cancel this order on this stage', 400);
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = orderValidator;
