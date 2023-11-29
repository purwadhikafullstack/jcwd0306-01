const { Order } = require('../../models');

async function getOrderByWarehouse(req) {
  const { warehouseId } = req.params;

  const data = await Order.findAndCountAll({
    where: {
      status: ['unpaid', 'verifying', 'processed', 'shipped'],
      warehouseId,
    },
    attributes: ['id'],
    logging: false,
  });

  return data;
}

module.exports = getOrderByWarehouse;
