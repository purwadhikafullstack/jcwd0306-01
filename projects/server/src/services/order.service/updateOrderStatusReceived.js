const { ResponseError } = require('../../errors');

async function updateOrderStatusReceived(req, order, transaction) {
  if (order.getDataValue('status') !== 'shipped')
    throw new ResponseError(
      'Cannot update to "received" if current status is not "shipped"',
      400
    );

  await order.update({ status: 'received' }, { transaction, logging: false });
}

module.exports = updateOrderStatusReceived;
