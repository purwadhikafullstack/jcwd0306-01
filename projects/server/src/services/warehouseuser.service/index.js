const createWarehouseUsersByWarehouseId = require('./createWarehouseUsersByWarehouseId');
const deleteWarehouseUsersByWarehouseId = require('./deleteWarehouseUsersByWarehouseId');
const getWarehouseUsersByWarehouseId = require('./getWarehouseUsersByWarehouseId');
const getAllWarehouseAdmin = require('./getAllWarehouseAdmin');

const warehouseUserService = {
  createWarehouseUsersByWarehouseId,
  deleteWarehouseUsersByWarehouseId,
  getWarehouseUsersByWarehouseId,
  getAllWarehouseAdmin,
};

module.exports = warehouseUserService;
