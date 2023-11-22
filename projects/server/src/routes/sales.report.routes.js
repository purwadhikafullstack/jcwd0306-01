const router = require('express').Router();
const salesReportController = require('../controllers/sales.report.controller');

router.get('/', salesReportController.getSalesReports);
router.get(
  '/:warehouseId/warehouse',
  salesReportController.getSalesReportByWarehouse
);
router.get(
  '/:categoryId/category',
  salesReportController.getSalesReportByCategory
);

module.exports = router;
