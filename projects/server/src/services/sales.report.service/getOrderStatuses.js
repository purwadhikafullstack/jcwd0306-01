const { Order } = require('../../models');

async function getOrderStatuses() {
  const data = await Order.findAll({
    attributes: ['id', 'status'],
    logging: false,
  });
  return data;
}

module.exports = getOrderStatuses;
