const createWarehouse = require('./createWarehouse');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');

const warehouseService = {
  createWarehouse,
  editWarehouseByWarehouseId,
  getWarehouses,
};

module.exports = warehouseService;
