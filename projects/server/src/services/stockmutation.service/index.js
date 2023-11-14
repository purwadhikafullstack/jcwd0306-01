const createStockMutation = require('./createStockMutation');
const getStockMutationByStockMutationId = require('./getStockMutationByStockMutationId');

const stockMutationService = {
  createStockMutation,
  getStockMutationByStockMutationId,
};

module.exports = stockMutationService;
