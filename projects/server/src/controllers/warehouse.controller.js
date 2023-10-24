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
};

module.exports = warehouseController;
