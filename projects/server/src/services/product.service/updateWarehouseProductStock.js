const { ResponseError } = require('../../errors');
const { sequelize, WarehouseProduct, StockHistory } = require('../../models');
const getProductByProductId = require('./getProductByProductId');

async function updateWarehouseProductStock(req) {
  const product = await sequelize.transaction(async (t) => {
    const { user } = req;
    const { productId } = req.params;
    const { warehouseId, quantity } = req.body;

    const warehouseProduct = await WarehouseProduct.findOne({
      where: { warehouseId, productId },
      paranoid: false,
      transaction: t,
    });
    if (!warehouseProduct)
      throw new ResponseError('Warehouse/product not found', 404); // check is warehouseproduct exist

    if (warehouseProduct.getDataValue('stock') + quantity < 0)
      throw new ResponseError(
        `[productId:${productId}] New stock in warehouse must be >= 0`,
        400
      ); // check new stock must be >= 0

    if (quantity !== 0) {
      await warehouseProduct.increment({ stock: quantity }, { transaction: t }); // update new stock
      await StockHistory.create(
        {
          warehouseId,
          productId,
          quantity,
          updatedStock: warehouseProduct.getDataValue('stock') + quantity,
          type: 'manual',
          adminId: user.id,
        },
        { transaction: t }
      ); // create stockhistory
    }

    const result = await getProductByProductId(productId, t); // get the result
    return result;
  });
  return product;
}

module.exports = updateWarehouseProductStock;
