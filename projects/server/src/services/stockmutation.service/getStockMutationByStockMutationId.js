const { ResponseError } = require('../../errors');
const { StockMutation } = require('../../models');

async function getStockMutationByStockMutationId(stockMutationId, transaction) {
  const stockMutation = await StockMutation.findByPk(stockMutationId, {
    transaction,
  });
  if (!stockMutation) throw new ResponseError('Stock mutation not found', 404);
  return stockMutation;
}

module.exports = getStockMutationByStockMutationId;
