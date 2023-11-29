const { ResponseError } = require('../../errors');
const { StockMutation, Product, Warehouse, Order } = require('../../models');

async function getStockMutationByStockMutationId(stockMutationId, transaction) {
  const stockMutation = await StockMutation.findByPk(stockMutationId, {
    logging: false,
    transaction,
    include: [
      { model: Product, paranoid: false },
      { model: Warehouse, paranoid: false, as: 'fromWarehouse' },
      { model: Warehouse, paranoid: false, as: 'toWarehouse' },
      { model: Order, attributes: { exclude: ['paymentProof'] } },
    ],
  });
  if (!stockMutation) throw new ResponseError('Stock mutation not found', 404);
  return stockMutation;
}

module.exports = getStockMutationByStockMutationId;
