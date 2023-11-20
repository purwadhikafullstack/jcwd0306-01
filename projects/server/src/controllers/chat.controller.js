const { chatService } = require('../services');
const { sendResponse } = require('../utils');

class ChatController {
  static postTextMessage = async (req, res) => {
    try {
      const result = await chatService.postTextMessage(req);
      const { warehouseId, orderId, receiverId, senderId } = result;
      if (receiverId === senderId) return res.send(result);
      if (!receiverId)
        global?.io?.emit(`channel-WHID-${warehouseId}-${orderId}`, {
          record: result,
        });
      else if (receiverId)
        global?.io?.emit(`channel-USER-${receiverId}-${orderId}`, {
          record: result,
        });
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

  static updateMultiRecord = async (req, res) => {
    try {
      await chatService.updateMultiRecord(req);
      return res.send('success');
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = ChatController;
