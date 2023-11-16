const { chatService } = require('../services');
const { sendResponse } = require('../utils');

class ChatController {
  static postTextMessage = async (req, res) => {
    try {
      const result = await chatService.postTextMessage(req);
      global?.io?.emit(`channel-${req.body.warehouseId}`);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getMessageByOrderId = async (req, res) => {
    try {
      const result = await chatService.getMessageByOrderId(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getByUserId = async (req, res) => {
    try {
      const result = await chatService.getAllChatRoom(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getAllUnreadMsg = async (req, res) => {
    try {
      const result = await chatService.getAllUnreadMsg(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = ChatController;
