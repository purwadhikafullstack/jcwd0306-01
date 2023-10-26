const route = require('express').Router();
const { OrderController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');

route.post(
  `/new/:userId`,
  verifyAuthUser({ isCustomer: true }),
  OrderController.createNewTransaction
);

module.exports = route;
