const createWarehouse = require('./createWarehouse');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');
const updateWarehouseActivationByWarehouseId = require('./updateWarehouseActivationByWarehouseId');
const getWarehouseByName = require('./getWarehouseByQuery');

const warehouseService = {
  createWarehouse,
  editWarehouseByWarehouseId,
  getWarehouses,
  updateWarehouseActivationByWarehouseId,
  getWarehouseByName,
};

module.exports = warehouseService;
