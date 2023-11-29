const router = require('express').Router();
const { stockMutationController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { stockMutationValidator } = require('../middlewares/validators');

// create stock mutation
router.post(
  '/',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  stockMutationValidator.createStockMutation,
  stockMutationController.createStockMutation
);

// delete stock mutation by stockMutationId
router.delete(
  '/:stockMutationId',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  stockMutationValidator.deleteStockMutationByStockMutationId,
  stockMutationController.deleteStockMutationByStockMutationId
);

// get stock mutation by stockMutationId
router.get(
  '/:stockMutationId',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  stockMutationValidator.getStockMutationByStockMutationId,
  stockMutationController.getStockMutationByStockMutationId
);

// get stock mutations
router.get(
  '/',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  stockMutationValidator.getStockMutations,
  stockMutationController.getStockMutations
);

// update stock mutation status by stockMutationId
router.patch(
  '/:stockMutationId',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  stockMutationValidator.updateStockMutationStatusByStockMutationId,
  stockMutationController.updateStockMutationStatusByStockMutationId
);

module.exports = router;
