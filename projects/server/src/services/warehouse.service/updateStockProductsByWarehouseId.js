const { ResponseError } = require('../../errors');
const { sequelize, WarehouseProduct, StockHistory } = require('../../models');
const { getProductByProductId } = require('../product.service');

async function updateStockProductsByWarehouseId(req) {
  const products = await sequelize.transaction(async (t) => {
    const { warehouseId } = req.params;

    const result = await Promise.all(
      req.body.stocks.map(({ productId, quantity }) =>
        WarehouseProduct.findOne({
          where: { warehouseId, productId },
          paranoid: false,
          transaction: t,
        }).then(async (warehouseProduct) => {
          if (!warehouseProduct)
            throw new ResponseError('Warehouse/product not found', 404); // check is warehouseproduct exist

          if (warehouseProduct.getDataValue('stock') + quantity < 0)
            throw new ResponseError(
              `[productId:${productId}] New stock in warehouse should not be < 0`,
              400
            ); // check new stock should not be < 0

          if (quantity !== 0) {
            await warehouseProduct.increment(
              { stock: quantity },
              { transaction: t }
            ); // update new stock

            await StockHistory.create(
              {
                warehouseId,
                productId,
                quantity,
                type: 'manual',
                adminId: req.user.id,
              },
              { transaction: t }
            ); // create stockhistory
          }

          const product = await getProductByProductId(productId, t); // get the result
          return product;
        })
      )
    );
    return result;
  });

  return products;
}

module.exports = updateStockProductsByWarehouseId;
