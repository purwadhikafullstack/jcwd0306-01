const createStockMutation = require('./createStockMutation');
const getStockMutationByStockMutationId = require('./getStockMutationByStockMutationId');
const updateStockMutationStatusByStockMutationId = require('./updateStockMutationStatusByStockMutationId');

const stockMutationService = {
  createStockMutation,
  getStockMutationByStockMutationId,
  updateStockMutationStatusByStockMutationId,
};

module.exports = stockMutationService;
