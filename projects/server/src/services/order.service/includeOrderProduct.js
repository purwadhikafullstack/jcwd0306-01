const db = require('../../models');

const includeOrderProduct = {
  model: db.OrderProduct,
  attributes: {
    exclude: ['updatedAt', 'createdAt'],
    include: [
      [
        db.sequelize.literal(
          'CAST((SELECT SUM(WarehouseProducts.stock) FROM WarehouseProducts WHERE WarehouseProducts.productId = OrderProducts.productId) AS SIGNED)'
        ),
        'stock',
      ],
    ],
  },
  include: [
    {
      model: db.Product,
      attributes: ['name', 'weight', 'price', 'discount'],
      include: { model: db.ProductImage, attributes: ['id'] },
    },
  ],
};

module.exports = includeOrderProduct;
