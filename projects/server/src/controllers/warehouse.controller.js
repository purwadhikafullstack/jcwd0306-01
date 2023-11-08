const { warehouseService } = require('../services');
const { sendResponse } = require('../utils');

const warehouseController = {
  createWarehouse: async (req, res) => {
    try {
      const warehouse = await warehouseService.createWarehouse(req);
      sendResponse({ res, statusCode: 201, data: warehouse });
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

  updateWarehouseActivationByWarehouseId: async (req, res) => {
    try {
      const warehouse =
        await warehouseService.updateWarehouseActivationByWarehouseId(req);
      sendResponse({ res, statusCode: 200, data: warehouse });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  updateStockProductsByWarehouseId: async (req, res) => {
    try {
      const products =
        await warehouseService.updateStockProductsByWarehouseId(req);
      sendResponse({ res, statusCode: 200, data: products });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = warehouseController;
