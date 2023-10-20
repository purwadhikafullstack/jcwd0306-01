const route = require('express').Router();
const { CityController } = require('../controllers');

route.get(``, CityController.getAll);

module.exports = route;
