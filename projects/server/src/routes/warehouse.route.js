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

// get warehouses
router.get('/', warehouseController.getWarehouses);

// update warehouse activation by warehouseId
router.put(
  '/:warehouseId',
  warehouseValidator.updateWarehouseActivationByWarehouseId,
  warehouseController.updateWarehouseActivationByWarehouseId
);

// update stock products by warehouseId
router.patch(
  '/:warehouseId/products',
  verifyAuthUser({
    isLogin: true,
    isAdmin: true,
    isWarehouseAdmin: true,
    isVerified: true,
  }),
  warehouseValidator.updateStockProductsByWarehouseId,
  warehouseController.updateStockProductsByWarehouseId
);

module.exports = router;
