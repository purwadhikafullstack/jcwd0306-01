const stockMutationService = require('../services/stockmutation.service');
const { sendResponse } = require('../utils');

const stockMutationController = {
  getStockMutationByStockMutationId: async (req, res) => {
    try {
      const stockMutation =
        await stockMutationService.getStockMutationByStockMutationId(
          req.params.stockMutationId
        );
      sendResponse({ res, statusCode: 200, data: stockMutation });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = stockMutationController;
