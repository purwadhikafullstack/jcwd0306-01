const productHistoryService = require('../services/product.history.services');
const { sendResponse } = require('../utils');

const productHistoryController = {
  getProductHistory: async (req, res) => {
    try {
      const [productHistory, paginationInfo] =
        await productHistoryService.getProducthistory(req);
      sendResponse({
        res,
        statusCode: 200,
        data: productHistory,
        ...paginationInfo,
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getStockMutationById: async (req, res) => {
    try {
      const stockMutation = await productHistoryService.getStockMutationById();
      sendResponse({
        res,
        statusCode: 200,
        data: stockMutation,
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = productHistoryController;
