const router = require('express').Router();
const { stockMutationController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { stockMutationValidator } = require('../middlewares/validators');

router.use(
  verifyAuthUser({
    isLogin: true,
    isVerified: true,
    isAdmin: true,
    isWarehouseAdmin: true,
  })
);

// create stock mutation
router.post(
  '/',
  stockMutationValidator.createStockMutation,
  stockMutationController.createStockMutation
);

// get stock mutation by stockMutationId
router.get(
  '/:stockMutationId',
  stockMutationValidator.getStockMutationByStockMutationId,
  stockMutationController.getStockMutationByStockMutationId
);

module.exports = router;
