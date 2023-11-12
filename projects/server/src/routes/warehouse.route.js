const router = require('express').Router();
const { warehouseController } = require('../controllers');
const { warehouseValidator } = require('../middlewares/validators');

// create warehouse
router.post(
  '/',
  warehouseValidator.createWarehouse,
  warehouseController.createWarehouse
);

// edit warehouse by warehouseId;
router.patch(
  '/:warehouseId',
  warehouseValidator.editWarehouseByWarehouseId,
  warehouseController.editWarehouseByWarehouseId
);

// get warehouse by warehouseId
router.get(
  '/:warehouseId',
  warehouseValidator.getWarehouseByWarehouseId,
  warehouseController.getWarehouseByWarehouseId
);

// get warehouses
router.get('/', warehouseController.getWarehouses);

// update warehouse activation by warehouseId
router.put(
  '/:warehouseId',
  warehouseValidator.updateWarehouseActivationByWarehouseId,
  warehouseController.updateWarehouseActivationByWarehouseId
);

module.exports = router;
