const { Order } = require('../../models');

async function getSalesReports() {
  const orders = await Order.findAll({
    where: { status: 'received' },
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
  return orders;
}

module.exports = getSalesReports;
