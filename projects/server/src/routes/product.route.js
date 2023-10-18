const router = require('express').Router();
const { productController } = require('../controllers');
// const { verifyAuthUser } = require('../middlewares/auth');
const { productValidator } = require('../middlewares/validators');

// get products
router.get(
  '/',
  // verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  productValidator.getProducts,
  productController.getProducts
);

module.exports = router;
