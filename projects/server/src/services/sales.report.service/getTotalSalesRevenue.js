const { Op } = require('sequelize');
const { Order } = require('../../models');

async function getTotalSalesRevenue() {
  const data = await Order.findAll({
    attributes: ['total'],
    where: {
      status: {
        [Op.or]: ['processed', 'received', 'shipped'],
      },
    },
    logging: false,
  });
  return data;
}

module.exports = getTotalSalesRevenue;
