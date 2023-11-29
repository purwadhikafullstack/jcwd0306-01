const router = require('express').Router();
const salesReportController = require('../controllers/sales.report.controller');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');

router.get(
  '/',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  salesReportController.getSalesReports
);
router.get(
  '/revenue',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  salesReportController.getTotalSalesRevenue
);
router.get('/order-statuses', salesReportController.getOrderStatuses);
router.get('/product-sold', salesReportController.getProductSold);
// get order by warehouse
router.get('/:warehouseId/order', salesReportController.getOrderByWarehouseId);
// get revenue by warehouse
router.get(
  '/:warehouseId/revenue',
  // verifyAuthUser({ isWarehouseAdmin: true }),
  salesReportController.getrevenueByWarehouse
);

router.get(
  '/:warehouseId/warehouse',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  salesReportController.getSalesReportByWarehouse
);
router.get(
  '/:categoryId/category',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  salesReportController.getSalesReportByCategory
);

module.exports = router;
