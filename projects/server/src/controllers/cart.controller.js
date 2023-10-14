const CartServices = require('../services/cart');

class CartController {
  static getCartByUserId = async (req, res) => {
    try {
      const data = await CartServices.getByUserId(req);
      return res.send(data);
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };

  static updateCart = async (req, res) => {
    try {
      const result = await CartServices.updateCart(req);
      return res.send(result);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  };

  static deleteItemOnCart = async (req, res) => {
    try {
      const result = await CartServices.deleteItemOnCart(req);
      return res.send(result);
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };
}

module.exports = CartController;
