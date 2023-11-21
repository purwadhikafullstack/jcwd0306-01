const route = require('express').Router();
const { ChatController } = require('../controllers');

// for user
route.get(`/rooms/:userId`, ChatController.getByUserId); // dapetin semua chatroom
// for admin
route.get(`/all`, ChatController.getByWarehouseId);
route.get(`/inbox`, ChatController.getAllUnreadMsg);

route.get(`/:userId/:orderId`, ChatController.getMessageByOrderId); // dapetin room spesifik
route.post(`/:userId`, ChatController.postTextMessage); // post new message

route.patch(`/multi_records`, ChatController.updateMultiRecord);

module.exports = route;
