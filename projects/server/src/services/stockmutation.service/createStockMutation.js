const { ResponseError } = require('../../errors');
const { sequelize, Sequelize, StockMutation, Order } = require('../../models');

async function createStockMutationTypeRequest(req, transaction) {
  const stockMutation = await StockMutation.create(
    { ...req.body, status: 'requested', requestAdminId: req.user.id },
    {
      fields: [
        'type',
        'productId',
        'fromWarehouseId',
        'toWarehouseId',
        'quantity',
        'status',
        'requestAdminId',
      ],
      transaction,
    }
  );
  return stockMutation;
}

async function createStockMutationTypeOrder(req, transaction) {
  const order = await Order.findByPk(req.body.orderId, {
    raw: true,
    transaction,
  });
  if (!order) throw new ResponseError('orderId not found', 404);
  if (order.warehouseId !== req.body.toWarehouseId)
    throw new ResponseError(
      'order.warehouseId does not match with toWarehouseId',
      400
    );
  if (order.status !== 'processed')
    throw new ResponseError(
      'stock mutation can only be created by an order with status="processed"',
      400
    );

  const stockMutation = await StockMutation.create(
    { ...req.body, status: 'processed' },
    {
      fields: [
        'type',
        'productId',
        'fromWarehouseId',
        'toWarehouseId',
        'quantity',
        'status',
        'orderId',
      ],
      transaction,
    }
  );
  return stockMutation;
}

async function createStockMutation(req) {
  const stockMutation = await sequelize.transaction(
    { isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE },
    async (t) => {
      const { type } = req.body;
      if (type === 'request') {
        const result = await createStockMutationTypeRequest(req, t);
        return result;
      }

      if (type === 'order') {
        const result = await createStockMutationTypeOrder(req, t);
        return result;
      }

      throw new ResponseError('Invalid stock mutation type', 400);
    }
  );
  return stockMutation;
}

module.exports = createStockMutation;
