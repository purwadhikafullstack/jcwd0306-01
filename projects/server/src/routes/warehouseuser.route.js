const router = require('express').Router();
const { warehouseUserController } = require('../controllers');
const { warehouseUserValidator } = require('../middlewares/validators');

// get all warehouse admin
router.get('/', warehouseUserController.getAllWarehouseAdmin);

// create warehouse users by user email
router.post(
  '/:warehouseId/users',
  // warehouseUserValidator.createWarehouseUsersByWarehouseId,
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

// edit warehouse user by warehouse Id
router.patch('/:whId', warehouseUserController.editWarehouseAdmin);

module.exports = router;
