const { Op } = require('sequelize');
const { sequelize } = require('../../models');
const Service = require('../baseServices');
const db = require('../../models');
const { ResponseError } = require('../../errors');

class ChatService extends Service {
  postTextMessage = (req) => this.create(req);

  getMessageByOrderId = async (req) => {
    const { userId, orderId } = req.params;
    const { page } = req.query;
    const limit = 20;
    const result = await this.getAll({
      logging: false,
      limit,
      order: [['createdAt', 'DESC']],
      offset: page ? (Number(page) - 1) * limit : 0,
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        orderId: orderId === 'null' ? null : orderId,
      },
      include: [
        { model: db.User, as: 'Receiver' },
        { model: db.User, as: 'Sender' },
      ],
    });
    return result;
  };

  getAllChatRoom = async (req) => {
    const { userId } = req.params;
    const result = await this.getAll({
      logging: false,
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
    const { warehouseId } = req.query;
    const totalUnread = await this.db.count({
      where: {
        warehouseId: { [Op.in]: warehouseId },
        isRead: false,
        receiverId: null,
      },
    });
    const result = await this.getAll({
      where: {
        id: [
          sequelize.literal(
            `(SELECT a.id from (SELECT *, row_number() OVER (PARTITION BY orderId order by createdAt DESC) as rn FROM Chats  WHERE warehouseId IN (${JSON.stringify(
              warehouseId
            ).slice(1, -1)}) AND receiverID IS NULL) as a where a.rn=1)`
          ),
        ],
      },
      logging: false,
      include: { model: db.User, as: 'Sender' },
    });
    result.totalUnread = totalUnread;
    return result;
  };

  updateMultiRecord = async (req) => {
    try {
      await sequelize.transaction(async (t) => {
        await this.db.bulkCreate(req.body.data, {
          transaction: t,
          logging: false,
          updateOnDuplicate: ['isRead'],
        });
      });
      return 'success';
    } catch (error) {
      throw new ResponseError(error?.message, 400);
    }
  };
}

module.exports = new ChatService('Chat');
