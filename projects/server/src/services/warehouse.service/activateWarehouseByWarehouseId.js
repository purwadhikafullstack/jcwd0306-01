const { Warehouse } = require('../../models');

async function activateWarehouseByWarehouseId(req) {
  await Warehouse.restore({ where: { id: req.params.warehouseId } });
}

module.exports = activateWarehouseByWarehouseId;
