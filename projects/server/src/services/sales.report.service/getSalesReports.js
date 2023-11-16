const {
  Order,
  OrderProduct,
  UserAddress,
  City,
  Warehouse,
  WarehouseAddress,
} = require('../../models');

async function getSalesReports() {
  const result = await Order.findAll({
    where: { status: 'received' },
    attributes: ['id', 'total', 'createdAt', 'invoiceId'],
    include: [
      {
        model: OrderProduct,
        attributes: ['productId'],
      },
      {
        model: UserAddress,
        attributes: ['cityId'],
        include: [{ model: City, attributes: ['name'] }],
      },
      {
        model: Warehouse,
        attributes: ['name'],
        include: [
          {
            model: WarehouseAddress,
            attributes: ['cityId'],
            include: { model: City, attributes: ['name'] },
          },
        ],
      },
    ],
  });
  return result;
}

module.exports = getSalesReports;
