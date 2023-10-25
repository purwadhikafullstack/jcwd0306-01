const createWarehouse = require('./createWarehouse');
const deleteWarehouseByWarehouseId = require('./deleteWarehouseByWarehouseId');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');

const warehouseService = {
  createWarehouse,
  deleteWarehouseByWarehouseId,
  editWarehouseByWarehouseId,
  getWarehouses,
};

module.exports = warehouseService;
