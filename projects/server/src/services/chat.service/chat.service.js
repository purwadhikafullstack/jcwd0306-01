const { Op } = require('sequelize');
const { sequelize } = require('../../models');
const Service = require('../baseServices');
const db = require('../../models');
const { ResponseError } = require('../../errors');
const includeSenderReceiver = require('./includeSenderReceiver');

class ChatService extends Service {
  postTextMessage = async (req) => {
    const result = await this.create(req);
    const sender = await db.User.findByPk(result.senderId);
    const receiver = await db.User.findByPk(result.receiverId);
    result.Sender = sender?.dataValues;
    result.Receiver = receiver?.dataValues;
    return result;
  };

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
      include: includeSenderReceiver,
    });
    return result;
  };

  getAllChatRoom = async (req) => {
    const { userId } = req.params;
    const result = await this.getAll({
      // logging: false,
      where: {
        [Op.and]: [
          { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
          {
            id: [
              sequelize.literal(
                `(SELECT a.id from (SELECT *, row_number() OVER (PARTITION BY orderId order by CreatedAt DESC) as rn FROM Chats  WHERE orderId IS NOT NULL AND senderId = ${userId} or receiverId = ${userId}) as a WHERE a.rn=1 ORDER BY a.receiverId DESC, a.createdAt DESC)`
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
    const whId = JSON.stringify(warehouseId).slice(1, -1);
    const totalUnread = await this.db.count({
      logging: false,
      where: {
        warehouseId: { [Op.in]: warehouseId },
        isRead: false,
        receiverId: null,
      },
    });
    const result = await this.getAll({
      logging: false,
      limit: 5,
      order: [['createdAt', 'DESC']],
      where: {
        id: [
          sequelize.literal(
            `(SELECT a.id from (SELECT *, row_number() OVER (PARTITION BY orderId order by createdAt DESC) as rn FROM Chats WHERE warehouseId IN (${whId}) AND receiverID IS NULL) as a where a.rn=1)`
          ),
        ],
      },

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

  getByWarehouseId = async (req) => {
    const { warehouseId } = req.query;
    const whId = JSON.stringify(warehouseId).slice(1, -1);
    const result = await this.getAll({
      logging: false,
      where: {
        warehouseId,
        id: [
          sequelize.literal(
            `(SELECT a.id from (SELECT *, row_number() OVER (PARTITION BY orderId order by createdAt DESC) as rn FROM Chats  WHERE warehouseId IN (${whId}) AND receiverID IS NULL) as a where a.rn=1)`
          ),
        ],
      },
    });
    return result;
  };

  getTotalUnread = async (req) => {
    const { userId } = req.params;
    const result = await this.db.count({
      logging: false,
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
    return { totalUnread: result };
  };
}

module.exports = new ChatService('Chat');
