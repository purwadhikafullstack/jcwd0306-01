const { ResponseError } = require('../../errors');

async function updateOrderStatusUnpaid(req, order, transaction) {
  if (order.getDataValue('status') !== 'verifying')
    throw new ResponseError(
      'Cannot update to "unpaid" if current status is not "verifying"',
      400
    );

  await order.update(
    { status: 'unpaid', paymentProof: null },
    { transaction, logging: false }
  );
}

module.exports = updateOrderStatusUnpaid;
