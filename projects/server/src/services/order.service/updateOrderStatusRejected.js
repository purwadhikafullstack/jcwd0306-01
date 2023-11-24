const { ResponseError } = require('../../errors');
const { StockHistory, WarehouseProduct } = require('../../models');

async function updateOrderStatusRejected(req, order, transaction) {
  if (
    !['unpaid', 'verifying', 'processed'].includes(order.getDataValue('status'))
  )
    throw new ResponseError(
      'Cannot update to "rejected" if current status is not "unpaid/verifying/processed"',
      400
    );

  if (order.getDataValue('status') === 'processed') {
    const stockHistories = await StockHistory.findAll({
      where: { type: 'order', orderId: order.getDataValue('id') },
      transaction,
      logging: false,
    });

    await Promise.all(
      stockHistories.map((sh) => {
        const { warehouseId, productId, quantity } = sh.toJSON();
        return WarehouseProduct.findOne({
          where: { warehouseId, productId },
          paranoid: false,
          transaction,
          logging: false,
        }).then(async (warehouseProduct) => {
          await warehouseProduct.increment('stock', {
            by: Math.abs(quantity),
            transaction,
            logging: false,
          });
          await StockHistory.create(
            {
              warehouseId,
              productId,
              quantity: Math.abs(quantity),
              updatedStock:
                warehouseProduct.getDataValue('stock') + Math.abs(quantity),
              type: 'order',
              orderId: order.getDataValue('id'),
            },
            { transaction, logging: false }
          );
        });
      })
    );
  }

  await order.update({ status: 'rejected' }, { transaction, logging: false });
}

module.exports = updateOrderStatusRejected;
