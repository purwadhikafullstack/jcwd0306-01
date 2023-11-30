const createWarehouse = require('./createWarehouse');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouseByWarehouseId = require('./getWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');
const updateWarehouseActivationByWarehouseId = require('./updateWarehouseActivationByWarehouseId');
const getWarehouseByUserId = require('./getWarehouseByUserId');
const getWarehouseByName = require('./getWarehouseByQuery');

const warehouseService = {
  createWarehouse,
  editWarehouseByWarehouseId,
  getWarehouseByWarehouseId,
  getWarehouses,
  updateWarehouseActivationByWarehouseId,
  getWarehouseByUserId,
  getWarehouseByName,
};

module.exports = warehouseService;
