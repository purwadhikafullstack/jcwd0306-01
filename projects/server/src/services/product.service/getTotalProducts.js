const { WarehouseProduct } = require('../../models');

async function getTotalProducts(req) {
  const { warehouseId } = req.query;
  const numberedWarehouseId = Number(warehouseId);
  console.log(numberedWarehouseId);

  const data1 = await WarehouseProduct.findAll({
    attributes: ['productId', 'stock'],
    logging: false,
  });

  const data2 = await WarehouseProduct.findAndCountAll({
    where: warehouseId && {
      warehouseId: numberedWarehouseId,
    },
    attributes: ['productId', 'stock'],
    logging: false,
  });

  if (warehouseId) return data2;
  return data1;
}

module.exports = getTotalProducts;
