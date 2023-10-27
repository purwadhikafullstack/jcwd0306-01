const route = require('express').Router();
const { OrderController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { multerBlobUploader } = require('../middlewares/multers');

route.get(
  `/payment_proof/:id`,
  // verifyAuthUser({ isCustomer: true }),
  OrderController.renderPaymentProof
);
route.get(
  `/user/:userId`,
  verifyAuthUser({ isCustomer: true }),
  OrderController.getOrderByUserId
);
route.get(
  `/:userId/:id`,
  verifyAuthUser({ isCustomer: true }),
  OrderController.getByID
);

route.post(
  `/payment_proof/:id`,
  multerBlobUploader().single(`image`),
  verifyAuthUser({ isCustomer: true }),
  OrderController.uploadPaymentProof
);
route.post(
  `/new/:userId`,
  verifyAuthUser({ isCustomer: true }),
  OrderController.createNewTransaction
);

module.exports = route;
