const { ResponseError } = require('../../errors');
const { Warehouse } = require('../../models');

async function deleteWarehouseByWarehouseId(req) {
  const result = await Warehouse.destroy({
    where: { id: req.params.warehouseId },
  });
  if (result === 0) throw new ResponseError('warehouse not found', 404);
}

module.exports = deleteWarehouseByWarehouseId;
