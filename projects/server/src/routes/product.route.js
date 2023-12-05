const router = require('express').Router();
const { productController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const multerBlobUploader = require('../middlewares/multers/multerBlobUploader');
const multerErrorHandler = require('../middlewares/multers/multerErrorHandler');
const { productValidator } = require('../middlewares/validators');

// create product
router.post(
  '/',
  verifyAuthUser({ isAdmin: true }),
  multerBlobUploader().array('images'),
  multerErrorHandler,
  productValidator.createProduct,
  productController.createProduct
);

// edit product by productId
router.patch(
  '/:productId',
  verifyAuthUser({ isAdmin: true }),
  multerBlobUploader().array('images'),
  multerErrorHandler,
  productValidator.editProductByProductId,
  productController.editProductByProductId
);

// get products
router.get('/', productValidator.getProducts, productController.getProducts);

// get total products (dashboard)
router.get('/total', productController.getTotalProducts);

// get all product (without pagination)
router.get(
  '/allProducts',
  verifyAuthUser({ isAdmin: true }),
  productController.getAllProducts
);

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
  verifyAuthUser({ isAdmin: true }),
  productValidator.updateProductActivationByProductId,
  productController.updateProductActivationByProductId
);

// update warehouse product stock
router.patch(
  '/:productId/warehouseproducts',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  productValidator.updateWarehouseProductStock,
  productController.updateWarehouseProductStock
);

module.exports = router;
