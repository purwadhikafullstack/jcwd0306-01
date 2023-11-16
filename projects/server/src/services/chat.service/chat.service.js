const { Op } = require('sequelize');
const { sequelize, Sequelize } = require('../../models');
const Service = require('../baseServices');

class ChatService extends Service {
  postTextMessage = (req) => this.create(req);

  getMessageByOrderId = async (req) => {
    const { userId, orderId } = req.params;
    const { page } = req.query;
    const limit = 20;
    const result = await this.getAll({
      limit,
      page: page ? (Number(page) - 1) * limit : 0,
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        orderId: orderId === 'null' ? null : orderId,
      },
    });
    return result;
  };

  getAllChatRoom = async (req) => {
    const { userId } = req.params;
    const result = await this.getAll({
      where: {
        [Op.and]: [
          { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
          {
            id: [
              sequelize.literal(
                `(SELECT a.id from (SELECT id, orderId from Chats  where orderId IS NOT NULL group by orderId order by createdAt desc) as a)`
              ),
            ],
          },
          { orderId: { [Op.ne]: null } },
        ],
      },
    });
    return result;
  };

  getAllUnreadMsg = async (req) => {
    const { warehouseId } = req.params;
    const result = await this.getAll({
      where: {
        id: [
          sequelize.literal(
            `(SELECT a.id from (SELECT id, warehouseId,isRead from Chats  where isRead = 0 and warehouseId = ${
              typeof warehouseId === 'object'
                ? JSON.stringify(warehouseId).slice(1, -1)
                : warehouseId
            } group by warehouseId order by createdAt desc) as a)`
          ),
        ],
      },
      limit: 7,
    });
  };
}

module.exports = new ChatService('Chat');
