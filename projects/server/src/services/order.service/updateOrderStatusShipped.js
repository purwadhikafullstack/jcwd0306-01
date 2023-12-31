const { ResponseError } = require('../../errors');

async function updateOrderStatusShipped(req, order, transaction) {
  if (order.getDataValue('status') !== 'processed')
    throw new ResponseError(
      'Cannot update to "shipped" if current status is not "processed"',
      400
    );

  const isUnresolvedMutationExist = !!order
    .getDataValue('StockMutations')
    .find((sm) => sm.status !== 'received');

  if (isUnresolvedMutationExist)
    throw new ResponseError(
      'Cannot update to "shipped" if unresolved stock mutation is still exist',
      400
    );

  if (!req.body.shippingReceipt)
    throw new ResponseError('shippingReceipt required!', 400);
  await order.update(
    { status: 'shipped', shippingReceipt: req.body.shippingReceipt },
    { transaction, logging: false }
  );
}

module.exports = updateOrderStatusShipped;
