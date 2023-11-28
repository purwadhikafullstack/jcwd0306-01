const { Order, OrderProduct, Product, Category } = require('../../models');

async function getSalesReportByCategory(req) {
  const { categoryId } = req.params;
  const result = await Order.findAndCountAll({
    where: { status: 'received' },
    include: [
      {
        model: OrderProduct,
        include: [
          {
            model: Product,
            attributes: {
              exclude: ['description', 'weight', 'deletedAt'],
            },
            include: [
              {
                model: Category,
                attributes: {
                  exclude: ['image'],
                },
                where: {
                  id: categoryId,
                },
              },
            ],
          },
        ],
      },
    ],
    attributes: {
      exclude: [
        'paymentProof',
        'invoiceId',
        'shippingReceipt',
        'promoCode',
        'isReadByAdmin',
        'isReadByUser',
      ],
    },
  });
  return result;
}

module.exports = getSalesReportByCategory;
