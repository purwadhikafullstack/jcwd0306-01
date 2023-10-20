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

// get product image by productImageId
router.get(
  '/images/:imageId',
  productValidator.getProductImageByImageId,
  productController.getProductImageByImageId
);

module.exports = router;
