const router = require('express').Router();
const { warehouseController } = require('../controllers');
const { warehouseValidator } = require('../middlewares/validators');

// create warehouse
router.post(
  '/',
  warehouseValidator.createWarehouse,
  warehouseController.createWarehouse
);

module.exports = router;
