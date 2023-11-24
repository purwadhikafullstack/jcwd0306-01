const {
  Order,
  OrderProduct,
  Product,
  WarehouseProduct,
} = require('../../models');

async function getSalesReportByWarehouse(req) {
  const { warehouseId } = req.params;
  const result = await Order.findAndCountAll({
    where: { status: 'received' },
    attributes: {
      exclude: [
        'shippingMethod',
        'shippingPrice',
        'userAddressId',
        'paymentProof',
        'invoiceId',
        'shippingReceipt',
        'promoCode',
        'isReadByAdmin',
        'isReadByUser',
      ],
    },
    include: [
      {
        model: OrderProduct,
        attributes: { exclude: ['note'] },
        include: [
          {
            model: Product,
            attributes: { exclude: ['description', 'weight', 'deletedAt'] },
            include: [
              {
                model: WarehouseProduct,
                attributes: { exclude: ['deletedAt'] },
                where: { warehouseId },
              },
            ],
          },
        ],
      },
    ],
  });
  return result;
}

module.exports = getSalesReportByWarehouse;
