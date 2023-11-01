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

  static getShippingOptions = async (req, res) => {
    try {
      return UserAddressService.getShippingOptionsWithRedis(req, res);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static delete = async (req, res) => {
    try {
      await UserAddressService.delete(req);
      return res.send('success');
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static setNewDefault = async (req, res) => {
    try {
      await UserAddressService.setNewDefault(req);
      return res.send('success');
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = UserAddressController;
