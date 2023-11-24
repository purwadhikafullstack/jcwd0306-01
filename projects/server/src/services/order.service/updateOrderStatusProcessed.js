const GeoPoint = require('geopoint');
const { ResponseError } = require('../../errors');
const {
  StockHistory,
  StockMutation,
  WarehouseProduct,
} = require('../../models');

async function updateOrderStatusProcessed(req, order, transaction) {
  if (order.getDataValue('status') !== 'verifying')
    throw new ResponseError(
      'Cannot update to "processed" if current status is not "verifying"',
      400
    );
  if (!order.getDataValue('Warehouse'))
    throw new ResponseError('Warehouse inactive', 400);

  // IF stock available in detination warehouse THEN decrease stock ELSE create Stock Mutation
  await Promise.all(
    order.getDataValue('OrderProducts').map((orderProduct) => {
      const warehouseId = order.getDataValue('warehouseId');
      const { productId, quantity } = orderProduct;
      const isStockAvailableInDestinationWarehouse =
        !!orderProduct.Product.WarehouseProducts.find(
          (wp) => wp.warehouseId === warehouseId && wp.stock >= quantity
        );

      // IF stock available in detination warehouse THEN decrease stock and create stock history type="order"
      if (isStockAvailableInDestinationWarehouse) {
        return WarehouseProduct.findOne({
          where: { warehouseId, productId },
          paranoid: false,
          transaction,
          logging: false,
        }).then(async (warehouseProduct) => {
          await warehouseProduct.decrement('stock', {
            by: quantity,
            transaction,
            logging: false,
          });
          await StockHistory.create(
            {
              warehouseId,
              productId,
              quantity: -quantity,
              updatedStock: warehouseProduct.getDataValue('stock') - quantity,
              type: 'order',
              orderId: order.getDataValue('id'),
            },
            { transaction, logging: false }
          );
        });
      }

      // ELSE create Stock Mutation and create stock history type="stock-mutation"
      const availableWarehouseProducts =
        orderProduct.Product.WarehouseProducts.filter(
          (wp) => wp.stock >= quantity
        );
      if (availableWarehouseProducts.length === 0)
        throw new ResponseError(
          `Product: ${orderProduct.Product.name} is empty in all warehouses`,
          400
        );
      const destinationPoint = new GeoPoint(
        order.getDataValue('Warehouse').WarehouseAddress.latitude,
        order.getDataValue('Warehouse').WarehouseAddress.longitude
      );
      const originWarehouses = availableWarehouseProducts.map((wp) => {
        const originPoint = new GeoPoint(
          wp.Warehouse.WarehouseAddress.latitude,
          wp.Warehouse.WarehouseAddress.longitude
        );
        const distance = destinationPoint.distanceTo(originPoint, true); // output distance in kilometers
        return { warehouseId: wp.warehouseId, distance };
      });
      originWarehouses.sort((a, b) => a.distance - b.distance); // sort by distance: lowest to highest, so the nearest warehouse is on index 0

      return WarehouseProduct.findOne({
        where: {
          warehouseId: originWarehouses[0].warehouseId,
          productId,
        },
        paranoid: false,
        transaction,
        logging: false,
      }).then(async (warehouseProduct) => {
        const stockMutation = await StockMutation.create(
          {
            type: 'order',
            productId,
            quantity,
            fromWarehouseId: originWarehouses[0].warehouseId,
            toWarehouseId: warehouseId,
            status: 'processed',
            orderId: order.getDataValue('id'),
          },
          { transaction, logging: false }
        );
        await warehouseProduct.decrement('stock', {
          by: quantity,
          transaction,
          logging: false,
        });
        await StockHistory.create(
          {
            warehouseId: originWarehouses[0].warehouseId,
            productId,
            quantity: -quantity,
            updatedStock: warehouseProduct.getDataValue('stock') - quantity,
            type: 'stock-mutation',
            stockMutationId: stockMutation.getDataValue('id'),
          },
          { transaction, logging: false }
        );
      });
    })
  );

  await order.update(
    { status: 'processed', adminId: req.user.id },
    { transaction, logging: false }
  );
}

module.exports = updateOrderStatusProcessed;
