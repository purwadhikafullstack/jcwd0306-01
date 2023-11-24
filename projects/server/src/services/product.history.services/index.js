const getProducthistory = require('./getProductHistory');
const getStockMutationById = require('./getStockMutationById');

const productHistoryService = {
  getProducthistory,
  getStockMutationById,
};

module.exports = productHistoryService;
