const route = require('express').Router();
const { ChatController } = require('../controllers');

// for user
route.get(`/rooms/:userId`, ChatController.getByUserId); // dapetin semua chatroom
route.get(`/:userId/:orderId`, ChatController.getMessageByOrderId); // dapetin room spesifik
route.post(`/:userId`, ChatController.postTextMessage); // post new message

// for admin
route.get(`/inbox`, ChatController.getAllUnreadMsg);

module.exports = route;
