const { Order } = require('../../models');

async function getrevenueByWarehouse(req) {
  const { warehouseId } = req.params;

  const data = await Order.findAll({
    where: {
      status: ['received'],
      warehouseId,
    },
    attributes: ['total'],
    logging: false,
  });

  return data;
}

module.exports = getrevenueByWarehouse;
