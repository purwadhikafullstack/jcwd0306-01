const stockMutationService = require('../services/stockmutation.service');
const { sendResponse } = require('../utils');

const stockMutationController = {
  createStockMutation: async (req, res) => {
    try {
      const stockMutation = await stockMutationService.createStockMutation(req);
      sendResponse({ res, statusCode: 201, data: stockMutation });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

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

  updateStockMutationStatusByStockMutationId: async (req, res) => {
    try {
      const stockMutation =
        await stockMutationService.updateStockMutationStatusByStockMutationId(
          req
        );
      sendResponse({ res, statusCode: 200, data: stockMutation });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = stockMutationController;
