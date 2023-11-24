const router = require('express').Router();
const { productHistoryController } = require('../controllers');

// get productHistory
router.get('/', productHistoryController.getProductHistory);

// get stock mutation by Id
router.get(
  '/stock-mutation/:stockMutationId',
  productHistoryController.getStockMutationById
);

// get productHistory by warehouse
router.get(
  '/:warehouseId',
  productHistoryController.getProductHistryByWarehouseId
);

module.exports = router;
