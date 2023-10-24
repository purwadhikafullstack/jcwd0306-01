const { warehouseUserService } = require('../services');
const { sendResponse } = require('../utils');

const warehouseUserController = {
  createWarehouseUsersByWarehouseId: async (req, res) => {
    try {
      const warehouse =
        await warehouseUserService.createWarehouseUsersByWarehouseId(req);
      sendResponse({ res, statusCode: 201, data: warehouse });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getWarehouseUsersByWarehouseId: async (req, res) => {
    try {
      const warehouse =
        await warehouseUserService.getWarehouseUsersByWarehouseId(req);
      sendResponse({ res, statusCode: 200, data: warehouse });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = warehouseUserController;
