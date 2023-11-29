const { ResponseError } = require('../../errors');
const {
  sequelize,
  Sequelize,
  Order,
  WarehouseProduct,
  StockHistory,
} = require('../../models');
const getStockMutationByStockMutationId = require('./getStockMutationByStockMutationId');

async function updateStockMutationStatusProcessed(
  req,
  stockMutation,
  transaction
) {
  const productId = stockMutation.getDataValue('productId');
  const warehouseId = stockMutation.getDataValue('fromWarehouseId');
  const quantity = stockMutation.getDataValue('quantity');
  if (stockMutation.getDataValue('status') !== 'requested')
    throw new ResponseError(
      'Stock mutation status can only be updated to "processed" if current status is "requested"',
      400
    );
  await stockMutation.update(
    { status: req.body.status, approveAdminId: req.user.id },
    { transaction, logging: false }
  ); // update stock mutation status and approveAdminId
  const warehouseProduct = await WarehouseProduct.findOne({
    where: { productId, warehouseId },
    paranoid: false,
    transaction,
    logging: false,
  }); // get the referred product in fromWarehouseId

  if (warehouseProduct.getDataValue('stock') < quantity)
    throw new ResponseError(
      'Stock mutation cannot be processed because product stock in fromWarehouseId is not enough',
      400
    ); // check is product stock in fromWarehouseId still enough
  await warehouseProduct.increment(
    { stock: -quantity },
    { transaction, logging: false }
  ); // decrease the product stock in fromWarehouseId
  await StockHistory.create(
    {
      type: 'stock-mutation',
      stockMutationId: stockMutation.getDataValue('id'),
      productId,
      warehouseId,
      quantity: -quantity,
      updatedStock: warehouseProduct.getDataValue('stock') - quantity,
    },
    { transaction, logging: false }
  ); // create stock history for fromWarehouseId
}

async function updateStockMutationStatusShipped(
  req,
  stockMutation,
  transaction
) {
  if (stockMutation.getDataValue('status') !== 'processed')
    throw new ResponseError(
      'Stock mutation status can only be updated to "shipped" if current status is "processed"',
      400
    );
  await stockMutation.update(
    { status: req.body.status },
    { transaction, logging: false }
  ); // update stock mutation status
}

async function updateStockMutationStatusRejected(
  req,
  stockMutation,
  transaction
) {
  const productId = stockMutation.getDataValue('productId');
  const warehouseId = stockMutation.getDataValue('fromWarehouseId');
  const currStatus = stockMutation.getDataValue('status');
  if (!['requested', 'processed', 'shipped'].includes(currStatus))
    throw new ResponseError(
      'Stock mutation status can only be updated to "rejected" if current status is "requested/processed/shipped"',
      400
    );
  if (stockMutation.getDataValue('type') === 'order')
    throw new ResponseError(
      'Stock mutation type="order" cannot be rejected',
      400
    );
  await stockMutation.update(
    { status: req.body.status },
    { transaction, logging: false }
  ); // update stock mutation status
  if (currStatus !== 'requested') {
    const warehouseProduct = await WarehouseProduct.findOne({
      where: { productId, warehouseId },
      paranoid: false,
      transaction,
      logging: false,
    });
    await warehouseProduct.increment(
      { stock: stockMutation.getDataValue('quantity') },
      { transaction, logging: false }
    ); // return the product stock to fromWarehouseId
    await StockHistory.create(
      {
        type: 'stock-mutation',
        stockMutationId: stockMutation.getDataValue('id'),
        productId,
        warehouseId,
        quantity: stockMutation.getDataValue('quantity'),
        updatedStock:
          warehouseProduct.getDataValue('stock') +
          stockMutation.getDataValue('quantity'),
      },
      { transaction, logging: false }
    ); // create stock history for fromWarehouseId
  }
}

async function updateStockMutationStatusReceived(
  req,
  stockMutation,
  transaction
) {
  const productId = stockMutation.getDataValue('productId');
  const warehouseId = stockMutation.getDataValue('toWarehouseId');
  const quantity = stockMutation.getDataValue('quantity');
  const orderId = stockMutation.getDataValue('orderId');
  if (stockMutation.getDataValue('status') !== 'shipped')
    throw new ResponseError(
      'Stock mutation status can only be updated to "received" if current status is "shipped"',
      400
    );
  await stockMutation.update(
    { status: req.body.status },
    { transaction, logging: false }
  ); // update stock mutation status
  const warehouseProduct = await WarehouseProduct.findOne({
    where: { productId, warehouseId },
    paranoid: false,
    transaction,
    logging: false,
  });
  await warehouseProduct.increment(
    { stock: quantity },
    { transaction, logging: false }
  ); // increase the product stock in toWarehouseId
  await StockHistory.create(
    {
      type: 'stock-mutation',
      stockMutationId: stockMutation.getDataValue('id'),
      productId,
      warehouseId,
      quantity,
      updatedStock: warehouseProduct.getDataValue('stock') + quantity,
    },
    { transaction, logging: false }
  ); // create stock history for toWarehouseId

  if (stockMutation.getDataValue('type') === 'order') {
    const order = await Order.findByPk(stockMutation.getDataValue('orderId'), {
      transaction,
      logging: false,
    });
    if (!['cancelled', 'rejected'].includes(order.getDataValue('status'))) {
      await warehouseProduct.reload({ transaction, logging: false });
      await warehouseProduct.increment(
        { stock: -quantity },
        { transaction, logging: false }
      ); // decrease the product stock in toWarehouseId for order
      await StockHistory.create(
        {
          type: 'order',
          orderId,
          productId,
          warehouseId,
          quantity: -quantity,
          updatedStock: warehouseProduct.getDataValue('stock') - quantity,
        },
        { transaction, logging: false }
      ); // create stock history for order
    }
  }
}

async function updateStockMutationStatusByStockMutationId(req) {
  const result = await sequelize.transaction(
    {
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      logging: false,
    },
    async (t) => {
      const { status } = req.body;
      const stockMutation = await getStockMutationByStockMutationId(
        req.params.stockMutationId,
        t
      );
      if (status === 'processed')
        await updateStockMutationStatusProcessed(req, stockMutation, t);
      else if (status === 'shipped')
        await updateStockMutationStatusShipped(req, stockMutation, t);
      else if (status === 'rejected')
        await updateStockMutationStatusRejected(req, stockMutation, t);
      else if (status === 'received')
        await updateStockMutationStatusReceived(req, stockMutation, t);
      return stockMutation;
    }
  );
  return result;
}

module.exports = updateStockMutationStatusByStockMutationId;
