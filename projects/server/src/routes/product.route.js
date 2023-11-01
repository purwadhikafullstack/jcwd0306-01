const router = require('express').Router();
const { productController } = require('../controllers');
const { productValidator } = require('../middlewares/validators');

// create product
router.post(
  '/',
  productValidator.createProduct,
  productController.createProduct
);

// get products
router.get('/', productValidator.getProducts, productController.getProducts);

// get product by productId
router.get(
  '/:id',
  productValidator.getProductById,
  productController.getProductById
);

// get product image by productImageId
router.get(
  '/images/:imageId',
  productValidator.getProductImageByImageId,
  productController.getProductImageByImageId
);

module.exports = router;
