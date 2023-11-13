const { cartService } = require('../services');
const { sendResponse } = require('../utils');

class CartController {
  static getCartByUserId = async (req, res) => {
    try {
      const data = await cartService.getCartByUserId(req);
      return res.send(data);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static createCart = async (req, res) => {
    try {
      const cart = await cartService.createCart(req);
      sendResponse({ res, statusCode: 201, data: cart });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static updateCart = async (req, res) => {
    try {
      const result = await cartService.updateCart(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static deleteItemOnCart = async (req, res) => {
    try {
      const result = await cartService.deleteItemOnCart(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = CartController;
