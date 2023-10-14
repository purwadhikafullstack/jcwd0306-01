const router = require('express').Router();
const { CartController } = require('../controllers');
const {
  quantityValidator,
} = require('../middlewares/validators/cartQuantityValidator');

router.get(`/:userId`, CartController.getCartByUserId);
router.post(`/:userId`, quantityValidator, CartController.updateCart);
router.delete(`/:userId`, CartController.deleteItemOnCart);

module.exports = router;
