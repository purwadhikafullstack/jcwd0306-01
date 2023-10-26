const { ResponseError } = require('../../errors');
const { Warehouse } = require('../../models');

async function deactivateWarehouseByWarehouseId(req) {
  const result = await Warehouse.destroy({
    where: { id: req.params.warehouseId },
  });
  if (result === 0) throw new ResponseError('warehouse not found', 404);
}

module.exports = deactivateWarehouseByWarehouseId;
