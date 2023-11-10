const createWarehouse = require('./createWarehouse');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouseByWarehouseId = require('./getWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');
const updateStockProductsByWarehouseId = require('./updateStockProductsByWarehouseId');
const updateWarehouseActivationByWarehouseId = require('./updateWarehouseActivationByWarehouseId');

const warehouseService = {
  createWarehouse,
  editWarehouseByWarehouseId,
  getWarehouseByWarehouseId,
  getWarehouses,
  updateWarehouseActivationByWarehouseId,
  updateStockProductsByWarehouseId,
};

module.exports = warehouseService;
