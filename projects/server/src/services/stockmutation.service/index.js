const createStockMutation = require('./createStockMutation');
const deleteStockMutationByStockMutationId = require('./deleteStockMutationByStockMutationId');
const getStockMutationByStockMutationId = require('./getStockMutationByStockMutationId');
const getStockMutations = require('./getStockMutations');
const updateStockMutationStatusByStockMutationId = require('./updateStockMutationStatusByStockMutationId');

const stockMutationService = {
  createStockMutation,
  deleteStockMutationByStockMutationId,
  getStockMutationByStockMutationId,
  getStockMutations,
  updateStockMutationStatusByStockMutationId,
};

module.exports = stockMutationService;
