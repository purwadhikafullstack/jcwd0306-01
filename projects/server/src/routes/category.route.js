const router = require('express').Router();
const { categoryController } = require('../controllers');
// const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const multerBlobUploader = require('../middlewares/multers/multerBlobUploader');
const multerErrorHandler = require('../middlewares/multers/multerErrorHandler');
const categoryValidator = require('../middlewares/validators/category.validator');

// create category
router.post(
  '/',
  // verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  multerBlobUploader().single('image'),
  multerErrorHandler,
  categoryValidator.createCategory,
  categoryController.createCategory
);

// delete category by categoryId
router.delete(
  '/:id',
  // verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  categoryValidator.deleteCategoryById,
  categoryController.deleteCategoryById
);

// edit category by categoryId
router.patch(
  '/:id',
  // verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  multerBlobUploader().single('image'),
  multerErrorHandler,
  categoryValidator.editCategoryById,
  categoryController.editCategoryById
);

// get categories
router.get(
  '/',
  // verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  categoryController.getCategories
);

// get category image by categoryId
router.get(
  '/:id/image',
  categoryValidator.getCategoryImageById,
  categoryController.getCategoryImageById
);

module.exports = router;
