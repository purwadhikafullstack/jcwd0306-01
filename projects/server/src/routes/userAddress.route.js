const { UserAddressController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { addressValidator } = require('../middlewares/validators');
const {
  longLatGenerator,
  shippingOptionInputValidator,
} = require('../middlewares/validators/userAddressValidator');

const route = require(`express`).Router();

route.get(
  `/:userId`,
  verifyAuthUser({ isCustomer: true }),
  UserAddressController.getAddressByUserId
);

route.post(
  '/shipping_option',
  verifyAuthUser({ isCustomer: true }),
  addressValidator.shippingOptionInputValidator,
  UserAddressController.getShippingOptions
);
route.post(
  `/new/:userId`,
  verifyAuthUser({ isCustomer: true }),
  addressValidator.addAndUpdate,
  longLatGenerator,
  UserAddressController.addAddress
);

route.patch(
  `/new_default/:userId/:id`,
  verifyAuthUser({ isCustomer: true }),
  UserAddressController.setNewDefault
);

route.patch(
  `/:userId/:id`,
  verifyAuthUser({ isCustomer: true }),
  addressValidator.addAndUpdate,
  longLatGenerator,
  UserAddressController.update
);

route.delete(
  `/:id`,
  verifyAuthUser({ isCustomer: true }),
  addressValidator.checkIsDefault,
  UserAddressController.delete
);

module.exports = route;
