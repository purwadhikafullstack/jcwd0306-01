const router = require('express').Router();
const { stockMutationController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { stockMutationValidator } = require('../middlewares/validators');

// get stock mutation by stockMutationId
router.get(
  '/:stockMutationId',
  verifyAuthUser({
    isLogin: true,
    isVerified: true,
    isAdmin: true,
    isWarehouseAdmin: true,
  }),
  stockMutationValidator.getStockMutationByStockMutationId,
  stockMutationController.getStockMutationByStockMutationId
);

module.exports = router;
