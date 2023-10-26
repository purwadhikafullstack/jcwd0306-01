const activateWarehouseByWarehouseId = require('./activateWarehouseByWarehouseId');
const createWarehouse = require('./createWarehouse');
const deleteWarehouseByWarehouseId = require('./deleteWarehouseByWarehouseId');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');

const warehouseService = {
  activateWarehouseByWarehouseId,
  createWarehouse,
  deleteWarehouseByWarehouseId,
  editWarehouseByWarehouseId,
  getWarehouses,
};

module.exports = warehouseService;
