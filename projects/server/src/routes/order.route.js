const route = require('express').Router();
const { OrderController } = require('../controllers');

route.post(`/new/:userId`, OrderController.createNewTransaction);

module.exports = route;
