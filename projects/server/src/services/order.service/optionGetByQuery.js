const { Op } = require('sequelize');
const db = require('../../models');

const optionGetByQuery = (limit, page, text, id, status, warehouseId) => ({
  logging: false,
  attributes: {
    exclude: ['paymentProof', `isReadByUser`],
  },
  limit,
  distinct: true,
  offset: page ? (Number(page) - 1) * limit : 0,
  order: [['updatedAt', 'ASC']],
  where: {
    status: { [Op.notIn]: ['unpaid', 'cancelled', 'rejected'] },
    ...(typeof status === 'string' && { status }),
    ...(typeof status === 'object' && { status: { [Op.in]: status } }),
    ...(typeof warehouseId === 'string' && { warehouseId }),
    ...(typeof warehouseId === 'object' && {
      warehouseId: { [Op.in]: warehouseId },
    }),
    ...(text && {
      [Op.or]: [
        {
          id: [
            db.sequelize.literal(
              `SELECT O.id from Orders AS O JOIN OrderProducts AS OP on O.id=OP.orderId JOIN Products as P on OP.productId = P.id where P.name like '%${text}%'`
            ),
          ],
        },
        // {
        //   invoiceId: { [Op.like]: `%${text}%` },
        // },
        { id: { [Op.like]: `${text}%` } },
        { shippingReceipt: { [Op.like]: `%${text}%` } },
      ],
    }),
    ...(id && {
      id: db.sequelize.where(
        db.sequelize.cast(db.sequelize.col('id'), 'varchar'),
        { [Op.like]: `%${id}%` }
      ),
    }),
  },
  // include: [this.includeOrderProduct, this.includeUserAddress],
});

module.exports = optionGetByQuery;
