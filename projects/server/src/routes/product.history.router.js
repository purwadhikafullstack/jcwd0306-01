const router = require('express').Router();
const { productHistoryController } = require('../controllers');

// get productHistory
router.get('/', productHistoryController.getProductHistory);

module.exports = router;
