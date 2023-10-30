const createWarehouse = require('./createWarehouse');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');
const updateWarehouseActivationByWarehouseId = require('./updateWarehouseActivationByWarehouseId');

const warehouseService = {
  createWarehouse,
  editWarehouseByWarehouseId,
  getWarehouses,
  updateWarehouseActivationByWarehouseId,
};

module.exports = warehouseService;
