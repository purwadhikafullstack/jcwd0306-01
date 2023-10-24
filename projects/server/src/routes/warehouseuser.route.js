const router = require('express').Router();
const { warehouseUserController } = require('../controllers');
const { warehouseUserValidator } = require('../middlewares/validators');

// create warehouseuser by warehouseId
router.post(
  '/:warehouseId/users',
  warehouseUserValidator.createWarehouseUserByWarehouseId,
  warehouseUserController.createWarehouseUserByWarehouseId
);

module.exports = router;
