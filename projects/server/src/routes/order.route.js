const route = require('express').Router();
const { OrderController } = require('../controllers');
const verifyAuthUser = require('../middlewares/auth/verifyAuthUser');
const idDecryptor = require('../middlewares/decryptor/idDecryptor');
const { multerBlobUploader } = require('../middlewares/multers');
const { orderValidator } = require('../middlewares/validators');

route.get(
  ``,
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  OrderController.getByQuery
);
route.get(
  `/payment_proof/:id`,
  idDecryptor,
  OrderController.renderPaymentProof
);
route.get(
  `/user/:userId`,
  verifyAuthUser({ isCustomer: true }),
  OrderController.getOrderByUserId
);
route.get(
  `/:userId/:id`,
  idDecryptor,
  verifyAuthUser({ isCustomer: true }),
  OrderController.getByID
);
route.get(
  `/:id`,
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  OrderController.getByID
);

route.patch(
  '/:id/status/receipt',
  idDecryptor,
  verifyAuthUser({ isCustomer: true }),
  OrderController.updateOrderStatusByUser
);

route.patch(
  `/:userId/:id`,
  idDecryptor,
  verifyAuthUser({ isCustomer: true }),
  orderValidator.checkStatus,
  OrderController.userUpdateOrder
);

route.patch(
  '/:id',
  idDecryptor,
  verifyAuthUser({ isAdmin: true, isWarehouseAdmin: true }),
  orderValidator.updateOrderStatus,
  OrderController.updateOrderStatus
);

// route.patch(
//   `/:id`,
//   idDecryptor,
//   verifyAuthUser({ isAdmin: true }),
//   orderValidator.rejectOrConfirm,
//   OrderController.adminUpdateOrder
// );

route.post(
  `/payment_proof/:id`,
  multerBlobUploader().single(`image`),
  idDecryptor,
  verifyAuthUser({ isCustomer: true }),
  OrderController.uploadPaymentProof
);
route.post(
  `/new/:userId`,
  verifyAuthUser({ isCustomer: true }),
  OrderController.createNewTransaction
);

module.exports = route;
