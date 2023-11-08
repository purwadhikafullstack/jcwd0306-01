const router = require('express').Router();
const { CartController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const {
  quantityValidator,
} = require('../middlewares/validators/cartQuantityValidator');

router.get(
  '/:userId',
  verifyAuthUser({ isCustomer: true, isAdmin: true }),
  CartController.getCartByUserId
);
router.post(
  '/',
  verifyAuthUser({
    isCustomer: true,
    isVerified: true,
    isLogin: true,
    isAdmin: true,
  }),
  CartController.createCart
);
router.post(
  '/:userId',
  verifyAuthUser({ isCustomer: true, isAdmin: true }),
  quantityValidator,
  CartController.updateCart
);
router.delete(
  '/:userId',
  verifyAuthUser({ isCustomer: true, isAdmin: true }),
  CartController.deleteItemOnCart
);

module.exports = router;
