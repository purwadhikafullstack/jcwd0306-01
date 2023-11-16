const { ResponseError } = require('../../errors');
const {
  sequelize,
  Sequelize,
  WarehouseProduct,
  StockHistory,
} = require('../../models');
const getStockMutationByStockMutationId = require('./getStockMutationByStockMutationId');

async function updateStockMutationStatusProcessed(
  req,
  stockMutation,
  transaction
) {
  if (stockMutation.getDataValue('status') !== 'requested')
    throw new ResponseError(
      'Stock mutation status can only be updated to "processed" if current status is "requested"',
      400
    );

  await stockMutation.update(
    { status: req.body.status, approveAdminId: req.user.id },
    { transaction }
  ); // update stock mutation status and approveAdminId

  const warehouseProduct = await WarehouseProduct.findOne({
    where: {
      productId: stockMutation.getDataValue('productId'),
      warehouseId: stockMutation.getDataValue('fromWarehouseId'),
    },
    paranoid: false,
    transaction,
  }); // get the referred product in fromWarehouseId

  if (
    warehouseProduct.getDataValue('stock') -
      stockMutation.getDataValue('quantity') <
    0
  )
    throw new ResponseError(
      'Stock mutation cannot be processed because product stock in fromWarehouseId is not enough',
      400
    ); // check is product stock in fromWarehouseId still enough

  await warehouseProduct.increment(
    { stock: -stockMutation.getDataValue('quantity') },
    { transaction }
  ); // decrease the product stock in fromWarehouseId
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
  await stockMutation.update({ status: req.body.status }, { transaction }); // update stock mutation status
}

async function updateStockMutationStatusRejected(
  req,
  stockMutation,
  transaction
) {
  const currStatus = stockMutation.getDataValue('status');
  if (!['requested', 'processed', 'shipped'].includes(currStatus))
    throw new ResponseError(
      'Stock mutation status can only be updated to "rejected" if current status is "requested/processed/shipped"',
      400
    );

  await stockMutation.update({ status: req.body.status }, { transaction }); // update stock mutation status

  if (currStatus !== 'requested') {
    await WarehouseProduct.increment(
      { stock: stockMutation.getDataValue('quantity') },
      {
        where: {
          productId: stockMutation.getDataValue('productId'),
          warehouseId: stockMutation.getDataValue('fromWarehouseId'),
        },
        paranoid: false,
        transaction,
      }
    ); // return the product stock to fromWarehouseId
  }
}

async function updateStockMutationStatusReceived(
  req,
  stockMutation,
  transaction
) {
  if (stockMutation.getDataValue('status') !== 'shipped')
    throw new ResponseError(
      'Stock mutation status can only be updated to "received" if current status is "shipped"',
      400
    );

  await stockMutation.update({ status: req.body.status }, { transaction }); // update stock mutation status

  await WarehouseProduct.increment(
    { stock: stockMutation.getDataValue('quantity') },
    {
      where: {
        productId: stockMutation.getDataValue('productId'),
        warehouseId: stockMutation.getDataValue('toWarehouseId'),
      },
      paranoid: false,
      transaction,
    }
  ); // increase the product stock in toWarehouseId

  await StockHistory.create(
    {
      type: 'stock-mutation',
      stockMutationId: stockMutation.getDataValue('id'),
      productId: stockMutation.getDataValue('productId'),
      warehouseId: stockMutation.getDataValue('fromWarehouseId'),
      quantity: -stockMutation.getDataValue('quantity'),
    },
    { transaction }
  ); // create stock history for fromWarehouseId

  await StockHistory.create(
    {
      type: 'stock-mutation',
      stockMutationId: stockMutation.getDataValue('id'),
      productId: stockMutation.getDataValue('productId'),
      warehouseId: stockMutation.getDataValue('toWarehouseId'),
      quantity: stockMutation.getDataValue('quantity'),
    },
    { transaction }
  ); // create stock history for toWarehouseId
}

async function updateStockMutationStatusByStockMutationId(req) {
  const result = await sequelize.transaction(
    { isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE },
    async (t) => {
      const { stockMutationId } = req.params;
      const { status } = req.body;

      const stockMutation = await getStockMutationByStockMutationId(
        stockMutationId,
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
