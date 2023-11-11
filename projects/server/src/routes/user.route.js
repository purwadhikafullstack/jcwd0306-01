const router = require('express').Router();
const { userController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');

router.get(
  '/getAll',
  /* verifyAuthUser({ isAdmin: true }), */ userController.getAllUsers
);
router.get(
  '/forgetPasswordToken',
  verifyAuthUser({ isCustomer: true }),
  userController.getForgetPasswordToken
);
router.get(
  `/details/:id`,
  verifyAuthUser({ isCustomer: true, isAdmin: true }),
  userController.getDetailsById
);

// // render blob by userId
// router.get('/render/:userId', userController.renderBlob);
// get category image by categoryId
router.get('/:id/image', userController.getUserImageById);
router.get('/:id', userController.getById);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/request-fp', userController.requestForgetPassword);
router.patch('/verify', userController.verify);
router.patch(
  '/edit-password',
  verifyAuthUser({ isCustomer: true }),
  userController.editPassword
);
router.patch(
  '/forget-password',
  verifyAuthUser({ isCustomer: true }),
  userController.forgetPassword
);
router.patch(
  '/edit/:userId',
  multerBlobUploader().single('file'),
  multerErrorHandler,
  userController.edit
);

module.exports = router;
