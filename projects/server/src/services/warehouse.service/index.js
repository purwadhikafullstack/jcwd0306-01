const createWarehouse = require('./createWarehouse');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouseByWarehouseId = require('./getWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');
const updateWarehouseActivationByWarehouseId = require('./updateWarehouseActivationByWarehouseId');

const warehouseService = {
  createWarehouse,
  editWarehouseByWarehouseId,
  getWarehouseByWarehouseId,
  getWarehouses,
  updateWarehouseActivationByWarehouseId,
};

module.exports = warehouseService;
