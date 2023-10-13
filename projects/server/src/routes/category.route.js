const router = require('express').Router();
const { categoryController } = require('../controllers');
// const { verifyAuthUser } = require('../middlewares/auth');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');
const { categoryValidator } = require('../middlewares/validators');

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

// get category by categoryId
router.get(
  '/:id',
  // verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  categoryValidator.getCategoryById,
  categoryController.getCategoryById
);

module.exports = router;
