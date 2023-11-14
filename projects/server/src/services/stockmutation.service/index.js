const createStockMutation = require('./createStockMutation');
const deleteStockMutationByStockMutationId = require('./deleteStockMutationByStockMutationId');
const getStockMutationByStockMutationId = require('./getStockMutationByStockMutationId');
const updateStockMutationStatusByStockMutationId = require('./updateStockMutationStatusByStockMutationId');

const stockMutationService = {
  createStockMutation,
  deleteStockMutationByStockMutationId,
  getStockMutationByStockMutationId,
  updateStockMutationStatusByStockMutationId,
};

module.exports = stockMutationService;
