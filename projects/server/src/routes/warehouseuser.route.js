const router = require('express').Router();
const { warehouseUserController } = require('../controllers');
const { warehouseUserValidator } = require('../middlewares/validators');

// create warehouse users by warehouseId
router.post(
  '/:warehouseId/users',
  warehouseUserValidator.createWarehouseUsersByWarehouseId,
  warehouseUserController.createWarehouseUsersByWarehouseId
);

// get warehouse users by warehouseId
router.get(
  '/:warehouseId/users',
  warehouseUserValidator.getWarehouseUsersByWarehouseId,
  warehouseUserController.getWarehouseUsersByWarehouseId
);

module.exports = router;
