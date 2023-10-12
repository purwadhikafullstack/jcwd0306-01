const router = require('express').Router();
const { categoryController } = require('../controllers');
// const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const multerBlobUploader = require('../middlewares/multers/multerBlobUploader');
const multerErrorHandler = require('../middlewares/multers/multerErrorHandler');
const categoryValidator = require('../middlewares/validators/category.validator');

router.post(
  '/',
  //   verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  multerBlobUploader().single('image'),
  multerErrorHandler,
  categoryValidator.createCategory,
  categoryController.createCategory
);

module.exports = router;
