const createWarehouse = require('./createWarehouse');
const editWarehouseByWarehouseId = require('./editWarehouseByWarehouseId');
const getWarehouses = require('./getWarehouses');
const updateWarehouseActivationByWarehouseId = require('./updateWarehouseActivationByWarehouseId');

const getWarehouseByUserId = require(`./getWarehouseByUserId`);

const warehouseService = {
  createWarehouse,
  editWarehouseByWarehouseId,
  getWarehouses,
  updateWarehouseActivationByWarehouseId,
  getWarehouseByUserId,
};

module.exports = warehouseService;
