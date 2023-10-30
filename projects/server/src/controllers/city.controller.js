const { CityService } = require('../services');
const { sendResponse } = require('../utils');

class CityController {
  static async getAll(req, res) {
    try {
      const result = await CityService.getCities(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  }
}

module.exports = CityController;
