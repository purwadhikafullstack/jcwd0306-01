const { Op } = require('sequelize');
const db = require('../../models');

const optionGetOrderByUserId = (
  page,
  userId,
  limit,
  name,
  status,
  associate = []
) => ({
  limit,
  attributes: {
    exclude: ['paymentProof', `adminId`],
  },
  offset: page ? (Number(page) - 1) * limit : 0,
  order: [['updatedAt', 'DESC']],
  required: true,
  where: {
    userId,
    ...(typeof status === 'string' && { status }),
    ...(typeof status === 'object' && { status: { [Op.in]: status } }),
    ...(name && {
      id: [
        db.sequelize.literal(
          `SELECT O.id from Orders AS O JOIN OrderProducts AS OP on O.id=OP.orderId JOIN Products as P on OP.productId = P.id where P.name like '%${name}%'`
        ),
      ],
    }),
  },
  include: associate,
});

module.exports = optionGetOrderByUserId;
