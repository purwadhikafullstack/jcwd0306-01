const createWarehouseUsersByWarehouseId = require('./createWarehouseUsersByWarehouseId');
const getWarehouseUsersByWarehouseId = require('./getWarehouseUsersByWarehouseId');

const warehouseUserService = {
  createWarehouseUsersByWarehouseId,
  getWarehouseUsersByWarehouseId,
};

module.exports = warehouseUserService;
