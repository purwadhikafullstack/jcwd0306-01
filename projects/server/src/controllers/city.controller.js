const { CityService } = require('../services');

class CityController {
  static async getAll(req, res) {
    try {
      const result = await CityService.getCities(req);
      return res.send(result);
    } catch (error) {
      return res.status(500).send(error?.message);
    }
  }
}

module.exports = CityController;
