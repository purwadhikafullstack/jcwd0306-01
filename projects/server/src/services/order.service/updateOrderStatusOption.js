const db = require('../../models');

const updateOrderStatusOption = {
  logging: false,
  attributes: { exclude: ['paymentProof'] },
  include: [
    { model: db.Warehouse, include: [{ model: db.WarehouseAddress }] },
    { model: db.StockMutation },
    {
      model: db.OrderProduct,
      include: [
        {
          model: db.Product,
          include: [
            {
              model: db.WarehouseProduct,
              include: [
                {
                  model: db.Warehouse,
                  include: [{ model: db.WarehouseAddress }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

module.exports = updateOrderStatusOption;
