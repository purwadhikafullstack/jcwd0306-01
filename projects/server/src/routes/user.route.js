const router = require('express').Router();
const { userController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');

router.get(
  `/details/:id`,
  verifyAuthUser({ isCustomer: true }),
  userController.getDetailsById
);
router.get('/:id', userController.getById);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.patch('/verify', userController.verify);
router.patch('/edit/:userId', userController.edit);
router.patch('/edit-password', userController.editPassword);

module.exports = router;
