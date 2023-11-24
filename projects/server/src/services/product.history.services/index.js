const getProducthistory = require('./getProductHistory');
const getStockMutationById = require('./getStockMutationById');
const getProductHistryByWarehouseId = require('./getProductHistoryByWarehouse');

const productHistoryService = {
  getProducthistory,
  getStockMutationById,
  getProductHistryByWarehouseId,
};

module.exports = productHistoryService;
