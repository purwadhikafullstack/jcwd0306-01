const router = require('express').Router();
const { userController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');

router.get(
  '/forgetPasswordToken',
  verifyAuthUser({ isCustomer: true }),
  userController.getForgetPasswordToken
);
router.get(
  '/details/:id',
  verifyAuthUser({ isCustomer: true }),
  userController.getDetailsById
);
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
router.patch('/edit/:userId', userController.edit);

module.exports = router;
