const { UserAddressController } = require('../controllers');

const route = require(`express`).Router();

route.get(`/:userId`, UserAddressController.getAddressByUserId);

route.post(`/new/:userId`, UserAddressController.addAddress);

route.patch(`/:id`, UserAddressController.update);

module.exports = route;
