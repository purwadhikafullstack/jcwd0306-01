const { ProvinceService } = require('../services');
const { sendResponse } = require('../utils');

class ProvinceController {
  static async getAll(req, res) {
    try {
      const result = await ProvinceService.getProvinces(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  }
}

module.exports = ProvinceController;
