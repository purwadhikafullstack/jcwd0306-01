const router = require('express').Router();
const { warehouseController } = require('../controllers');
const { warehouseValidator } = require('../middlewares/validators');

// create warehouse
router.post(
  '/',
  warehouseValidator.createWarehouse,
  warehouseController.createWarehouse
);

// delete warehouse by warehouseId
router.delete(
  '/:warehouseId',
  warehouseValidator.deleteWarehouseByWarehouseId,
  warehouseController.deleteWarehouseByWarehouseId
);

// edit warehouse by warehouseId;
router.patch(
  '/:warehouseId',
  warehouseValidator.editWarehouseByWarehouseId,
  warehouseController.editWarehouseByWarehouseId
);

// get warehouses
router.get('/', warehouseController.getWarehouses);

module.exports = router;
