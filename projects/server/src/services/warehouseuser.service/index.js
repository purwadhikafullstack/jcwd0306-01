const createWarehouseUsersByWarehouseId = require('./createWarehouseUsersByWarehouseId');
const deleteWarehouseUsersByWarehouseId = require('./deleteWarehouseUsersByWarehouseId');
const getWarehouseUsersByWarehouseId = require('./getWarehouseUsersByWarehouseId');

const warehouseUserService = {
  createWarehouseUsersByWarehouseId,
  deleteWarehouseUsersByWarehouseId,
  getWarehouseUsersByWarehouseId,
};

module.exports = warehouseUserService;
