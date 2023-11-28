const router = require('express').Router();
const { warehouseController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
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

// get WHID for admin
router.get(
  `/admin/:userId`,
  // verifyAuthUser({ isWarehouseAdmin: true }),
  warehouseController.getWarehouseByUserId
);
// get Warehouse By Name
router.get('/search', warehouseController.getWarehouseByName);

// update warehouse activation by warehouseId
router.put(
  '/:warehouseId',
  warehouseValidator.updateWarehouseActivationByWarehouseId,
  warehouseController.updateWarehouseActivationByWarehouseId
);

module.exports = router;
