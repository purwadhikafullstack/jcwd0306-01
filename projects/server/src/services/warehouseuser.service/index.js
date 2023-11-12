const createWarehouseUsersByWarehouseId = require('./createWarehouseUsersByWarehouseId');
const deleteWarehouseUsersByWarehouseId = require('./deleteWarehouseUsersByWarehouseId');
const getWarehouseUsersByWarehouseId = require('./getWarehouseUsersByWarehouseId');
const getAllWarehouseAdmin = require('./getAllWarehouseAdmin');
const editWarehouseAdmin = require('./editWarehouseAdmin');

const warehouseUserService = {
  createWarehouseUsersByWarehouseId,
  deleteWarehouseUsersByWarehouseId,
  getWarehouseUsersByWarehouseId,
  getAllWarehouseAdmin,
  editWarehouseAdmin,
};

module.exports = warehouseUserService;
