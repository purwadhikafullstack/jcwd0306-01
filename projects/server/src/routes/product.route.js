const router = require('express').Router();
const { productController } = require('../controllers');
const multerBlobUploader = require('../middlewares/multers/multerBlobUploader');
const multerErrorHandler = require('../middlewares/multers/multerErrorHandler');
const { productValidator } = require('../middlewares/validators');

// create product
router.post(
  '/',
  multerBlobUploader().array('images'),
  multerErrorHandler,
  productValidator.createProduct,
  productController.createProduct
);

// edit product by productId
router.patch(
  '/:productId',
  productValidator.editProductByProductId,
  productController.editProductByProductId
);

// get products
router.get('/', productValidator.getProducts, productController.getProducts);

// get product by productId
router.get(
  '/:productId',
  productValidator.getProductByProductId,
  productController.getProductByProductId
);

// get product image by productImageId
router.get(
  '/images/:imageId',
  productValidator.getProductImageByImageId,
  productController.getProductImageByImageId
);

// update product activation by productId
router.put(
  '/:productId',
  productValidator.updateProductActivationByProductId,
  productController.updateProductActivationByProductId
);

module.exports = router;
