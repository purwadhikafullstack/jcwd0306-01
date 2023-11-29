const router = require('express').Router();
const { warehouseController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { warehouseValidator } = require('../middlewares/validators');

// create warehouse
router.post(
  '/',
  verifyAuthUser({ isAdmin: true }),
  warehouseValidator.createWarehouse,
  warehouseController.createWarehouse
);

// edit warehouse by warehouseId;
router.patch(
  '/:warehouseId',
  verifyAuthUser({ isAdmin: true }),
  warehouseValidator.editWarehouseByWarehouseId,
  warehouseController.editWarehouseByWarehouseId
);

// get warehouse by warehouseId
router.get(
  '/:warehouseId',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  warehouseValidator.getWarehouseByWarehouseId,
  warehouseController.getWarehouseByWarehouseId
);

// get warehouses
router.get(
  '/',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  warehouseValidator.getWarehouses,
  warehouseController.getWarehouses
);

// get WHID for admin
router.get(
  '/admin/:userId',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  warehouseController.getWarehouseByUserId
);

// get Warehouse By Name
router.get(
  '/search',
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  warehouseController.getWarehouseByName
);

// update warehouse activation by warehouseId
router.put(
  '/:warehouseId',
  verifyAuthUser({ isAdmin: true }),
  warehouseValidator.updateWarehouseActivationByWarehouseId,
  warehouseController.updateWarehouseActivationByWarehouseId
);

module.exports = router;
