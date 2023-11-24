const { chatService } = require('../services');
const { sendResponse } = require('../utils');

class ChatController {
  static postTextMessage = async (req, res) => {
    try {
      const result = await chatService.postTextMessage(req);
      const { warehouseId, receiverId, senderId } = result;
      if (receiverId === senderId) return res.send(result);
      if (!receiverId)
        global?.io?.emit(`channel-WHID-${warehouseId}`, {
          record: result,
        });
      else if (receiverId)
        global?.io?.emit(`channel-USER-${receiverId}`, {
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
      const { receiverId, warehouseId, orderId } = req.body.data[0];
      await chatService.updateMultiRecord(req);
      if (!receiverId)
        global?.io?.emit(`updateMultiRecord-WHSE-${warehouseId}`, {
          total: req.body.data.length,
          orderId,
        });
      else
        global?.io?.emit(`updateMultiRecord-USER-${receiverId}`, {
          total: req.body.data.length,
          orderId,
        });
      return res.send('success');
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getByWarehouseId = async (req, res) => {
    try {
      const result = await chatService.getByWarehouseId(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getTotalUnread = async (req, res) => {
    try {
      const result = await chatService.getTotalUnread(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };
}

module.exports = ChatController;
