const { warehouseUserService } = require('../services');
const { sendResponse } = require('../utils');

const warehouseUserController = {
  createWarehouseUserByWarehouseId: async (req, res) => {
    try {
      const warehouseUser =
        await warehouseUserService.createWarehouseUserByWarehouseId(req);
      sendResponse({ res, statusCode: 201, data: warehouseUser });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = warehouseUserController;
