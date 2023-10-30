const route = require('express').Router();
const { OrderController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const { multerBlobUploader } = require('../middlewares/multers');
const { orderValidator } = require('../middlewares/validators');

route.get(`/payment_proof/:id`, OrderController.renderPaymentProof);
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

route.patch(
  `/cancel/:userId/:id`,
  verifyAuthUser({ isCustomer: true }),
  orderValidator.checkStatus,
  OrderController.userCancelOrder
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
