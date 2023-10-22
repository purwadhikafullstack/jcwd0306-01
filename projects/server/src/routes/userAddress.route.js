const { UserAddressController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { addressValidator } = require('../middlewares/validators');
const {
  longLatGenerator,
} = require('../middlewares/validators/userAddressValidator');

const route = require(`express`).Router();

route.get(
  `/:userId`,
  // verifyAuthUser({ isCustomer: true, idParams: true }),
  UserAddressController.getAddressByUserId
);

route.post(
  '/payment_option',
  // verifyAuthUser({ isCustomer: true, idParams: true }),
  UserAddressController.paymentOptions
);
route.post(
  `/new/:userId`,
  // verifyAuthUser({ isCustomer: true, idParams: true }),
  addressValidator.addAndUpdate,
  longLatGenerator,
  UserAddressController.addAddress
);

route.patch(
  `/:userId/:id`,
  // verifyAuthUser({ isCustomer: true, idParams: true }),
  addressValidator.addAndUpdate,
  longLatGenerator,
  UserAddressController.update
);

module.exports = route;
