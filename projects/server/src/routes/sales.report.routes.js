const router = require('express').Router();
const salesReportController = require('../controllers/sales.report.controller');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');

router.get(
  '/',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  salesReportController.getSalesReports
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
