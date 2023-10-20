const { UserAddressService } = require('../services');

class UserAddressController {
  static getAddressByUserId = async (req, res) => {
    try {
      const result = await UserAddressService.getAddressByUserId(req);
      return res.send(result);
    } catch (error) {
      return res.status(500).send(error?.message);
    }
  };

  static addAddress = async (req, res) => {
    try {
      const result = await UserAddressService.create(req);
      return res.send(result);
    } catch (error) {
      return res.status(500).send(error?.message);
    }
  };

  static update = async (req, res) => {
    try {
      await UserAddressService.update(req);
      return res.send('success');
    } catch (error) {
      return res.status(500).send(error?.message);
    }
  };
}

module.exports = UserAddressController;
