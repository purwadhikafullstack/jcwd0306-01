const { UserAddressService } = require('../services');
const { sendResponse } = require('../utils');

class UserAddressController {
  static getAddressByUserId = async (req, res) => {
    try {
      const result = await UserAddressService.getAddressByUserId(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static addAddress = async (req, res) => {
    try {
      const result = await UserAddressService.create(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static update = async (req, res) => {
    try {
      await UserAddressService.update(req);
      return res.send(req.body);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static paymentOptions = async (req, res) => {
    try {
      const result = await UserAddressService.paymentOptions(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = UserAddressController;
