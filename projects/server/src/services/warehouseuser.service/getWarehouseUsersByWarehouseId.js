const { ResponseError } = require('../../errors');
const { Warehouse, WarehouseUser } = require('../../models');

async function getWarehouseUsersByWarehouseId(req) {
  const { warehouseId } = req.params;
  const warehouse = await Warehouse.findByPk(warehouseId, {
    include: [{ model: WarehouseUser }],
  });
  if (!warehouse) throw new ResponseError('warehouse not found', 404);
  return warehouse;
}

module.exports = getWarehouseUsersByWarehouseId;
