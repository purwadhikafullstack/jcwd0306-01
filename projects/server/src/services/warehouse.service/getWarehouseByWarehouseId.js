const { ResponseError } = require('../../errors');
const { Warehouse, WarehouseAddress, Province, City } = require('../../models');

async function getWarehouseByWarehouseId(warehouseId, transaction) {
  const warehouse = await Warehouse.findByPk(warehouseId, {
    paranoid: false,
    include: [
      {
        model: WarehouseAddress,
        include: [{ model: Province }, { model: City }],
      },
    ],
    transaction,
  });
  if (!warehouse) throw new ResponseError('Warehouse not found', 404);
  return warehouse;
}

module.exports = getWarehouseByWarehouseId;
