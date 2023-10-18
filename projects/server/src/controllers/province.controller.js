const { ProvinceService } = require('../services');

class ProvinceController {
  static async getAll(req, res) {
    try {
      const result = await ProvinceService.getProvinces(req);
      return res.send(result);
    } catch (error) {
      return res.status(500).send(error?.message);
    }
  }
}

module.exports = ProvinceController;
