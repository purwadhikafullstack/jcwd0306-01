const db = require('../../../models');

const includeOrderProductAndWarehouseProduct = {
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
      attributes: ['name', 'weight'],
      include: [
        { model: db.ProductImage, attributes: ['id'] },
        {
          model: db.WarehouseProduct,
          attributes: ['warehouseId', 'productId', 'stock'],
          include: { model: db.Warehouse, include: db.WarehouseAddress },
        },
      ],
    },
  ],
};

module.exports = includeOrderProductAndWarehouseProduct;
