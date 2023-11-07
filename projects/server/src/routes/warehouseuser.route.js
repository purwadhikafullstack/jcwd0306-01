const router = require('express').Router();
const { warehouseUserController } = require('../controllers');
const { warehouseUserValidator } = require('../middlewares/validators');

// get all warehouse admin
router.get('/', warehouseUserController.getAllWarehouseAdmin);

// create warehouse users by warehouseId
router.post(
  '/:warehouseId/users',
  warehouseUserValidator.createWarehouseUsersByWarehouseId,
  warehouseUserController.createWarehouseUsersByWarehouseId
);

// delete warehouse users by warehouseId
router.delete(
  '/:warehouseId/users',
  warehouseUserValidator.deleteWarehouseUsersByWarehouseId,
  warehouseUserController.deleteWarehouseUsersByWarehouseId
);

// get warehouse users by warehouseId
router.get(
  '/:warehouseId/users',
  warehouseUserValidator.getWarehouseUsersByWarehouseId,
  warehouseUserController.getWarehouseUsersByWarehouseId
);

module.exports = router;
