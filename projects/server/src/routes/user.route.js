const router = require('express').Router();
const { userController } = require('../controllers');

router.get('/:id', userController.getById);

module.exports = router;
