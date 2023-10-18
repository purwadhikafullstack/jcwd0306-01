const route = require('express').Router();
const { ProvinceController } = require('../controllers');

route.get(``, ProvinceController.getAll);

module.exports = route;
