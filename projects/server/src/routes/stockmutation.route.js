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

// delete stock mutation by stockMutationId
router.delete(
  '/:stockMutationId',
  stockMutationValidator.deleteStockMutationByStockMutationId,
  stockMutationController.deleteStockMutationByStockMutationId
);

// get stock mutation by stockMutationId
router.get(
  '/:stockMutationId',
  stockMutationValidator.getStockMutationByStockMutationId,
  stockMutationController.getStockMutationByStockMutationId
);

// get stock mutations
router.get(
  '/',
  stockMutationValidator.getStockMutations,
  stockMutationController.getStockMutations
);

// update stock mutation status by stockMutationId
router.patch(
  '/:stockMutationId',
  stockMutationValidator.updateStockMutationStatusByStockMutationId,
  stockMutationController.updateStockMutationStatusByStockMutationId
);

module.exports = router;
