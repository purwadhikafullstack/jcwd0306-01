const { CartService } = require('../services');
const { sendResponse } = require('../utils');

class CartController {
  static getCartByUserId = async (req, res) => {
    try {
      const data = await CartService.getCartByUserId(req);
      return res.send(data);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static updateCart = async (req, res) => {
    try {
      const result = await CartService.updateCart(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static deleteItemOnCart = async (req, res) => {
    try {
      const result = await CartService.deleteItemOnCart(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = CartController;
