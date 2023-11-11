const { warehouseUserService } = require('../services');
const { sendResponse } = require('../utils');

const warehouseUserController = {
  createWarehouseUsersByWarehouseId: async (req, res) => {
    try {
      const warehouse =
        await warehouseUserService.createWarehouseUsersByWarehouseId(req);
      sendResponse({ res, statusCode: 201, data: warehouse });
    } catch (error) {
      console.log(error);
      sendResponse({ res, error });
    }
  },

  deleteWarehouseUsersByWarehouseId: async (req, res) => {
    try {
      await warehouseUserService.deleteWarehouseUsersByWarehouseId(req);
      res.sendStatus(204);
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

  getAllWarehouseAdmin: async (req, res) => {
    try {
      const warehouseAdmin = await warehouseUserService.getAllWarehouseAdmin();
      sendResponse({ res, statusCode: 200, data: warehouseAdmin });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = warehouseUserController;
