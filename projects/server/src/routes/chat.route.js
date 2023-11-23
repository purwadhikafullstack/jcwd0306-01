const route = require('express').Router();
const { ChatController } = require('../controllers');
const { chatValidator } = require('../middlewares/validators');

// for user
route.get(`/rooms/:userId`, ChatController.getByUserId); // dapetin semua chatroom
route.get(`/unread/:userId`, ChatController.getTotalUnread);
// for admin
route.get(`/all`, ChatController.getByWarehouseId);
route.get(`/inbox`, ChatController.getAllUnreadMsg);

route.get(`/:userId/:orderId`, ChatController.getMessageByOrderId); // dapetin room spesifik

// post new message
route.post(
  `/:userId`,
  chatValidator.inputValidator,
  ChatController.postTextMessage
);

route.patch(`/multi_records`, ChatController.updateMultiRecord);

module.exports = route;
