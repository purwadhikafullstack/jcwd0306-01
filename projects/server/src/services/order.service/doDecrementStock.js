const db = require('../../models');

const doDecrementStock = async (
  t,
  quantity = 0,
  warehouseId = 0,
  productId = 0
) => {
  await db.WarehouseProduct.decrement('stock', {
    by: quantity,
    where: { productId, warehouseId },
    transaction: t,
    logging: false,
  });
};
module.exports = doDecrementStock;
