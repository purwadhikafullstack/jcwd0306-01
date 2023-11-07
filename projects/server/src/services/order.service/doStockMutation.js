/* eslint-disable no-await-in-loop */
const db = require('../../models');

const doStockMutation = async (
  t,
  warehouseId = 0,
  nearbyWhse = [],
  quantity = 0
) => {
  for (let i = 0; i < nearbyWhse.length; i += 1) {
    const whsData = nearbyWhse[i].dataValues;
    const totalMutation = whsData.stock > quantity ? quantity : whsData.stock;
    if (whsData.warehouseId !== warehouseId) {
      await db.StockMutation.create(
        {
          productId: whsData.productId,
          fromWarehouseId: whsData.warehouseId,
          toWarehouseId: warehouseId,
          status: 'processed',
          quantity: totalMutation,
          type: 'order',
        },
        { transaction: t, logging: false }
      );
      // decrement warehouse origin
      await db.WarehouseProduct.decrement('stock', {
        by: totalMutation,
        where: {
          productId: whsData.productId,
          warehouseId: whsData.warehouseId,
        },
        transaction: t,
        logging: false,
      });
      // increment warehouse destination
      await db.WarehouseProduct.increment('stock', {
        by: totalMutation,
        where: { productId: whsData.productId, warehouseId },
        transaction: t,
        logging: false,
      });
    }
    if (totalMutation === quantity) break;
  }
  return 'success';
};

module.exports = { doStockMutation };
