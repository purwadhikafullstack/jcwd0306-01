const router = require('express').Router();
const { userController } = require('../controllers');

router.get('/getAll', userController.test);

module.exports = router;
