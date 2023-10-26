const { warehouseService } = require('../services');
const { sendResponse } = require('../utils');

const warehouseController = {
  activateWarehouseByWarehouseId: async (req, res) => {
    try {
      await warehouseService.activateWarehouseByWarehouseId(req);
      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  createWarehouse: async (req, res) => {
    try {
      const warehouse = await warehouseService.createWarehouse(req);
      sendResponse({ res, statusCode: 201, data: warehouse });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteWarehouseByWarehouseId: async (req, res) => {
    try {
      await warehouseService.deleteWarehouseByWarehouseId(req);
      res.sendStatus(204);
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editWarehouseByWarehouseId: async (req, res) => {
    try {
      const warehouse = await warehouseService.editWarehouseByWarehouseId(req);
      sendResponse({ res, statusCode: 200, data: warehouse });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getWarehouses: async (req, res) => {
    try {
      const warehouses = await warehouseService.getWarehouses();
      sendResponse({ res, statusCode: 200, data: warehouses });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = warehouseController;
