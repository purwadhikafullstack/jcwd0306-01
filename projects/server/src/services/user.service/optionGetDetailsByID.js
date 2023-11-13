const db = require('../../models');

const attributesCountStatus = {
  include: [
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'verifying' GROUP BY status)`
      ),
      'verifying',
    ],
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'processed' GROUP BY status)`
      ),
      'processed',
    ],
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'shipped' GROUP BY status)`
      ),
      'shipped',
    ],
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'received' AND isReadByUser = false GROUP BY status)`
      ),
      'received',
    ],
  ],
};

const includeOrderCart = [
  { model: db.WarehouseUser, paranoid: false },
  {
    model: db.Order,
    as: 'UserOrder',
    where: { status: 'unpaid' },
    required: false,
  },
  {
    model: db.Cart,
    required: false,
    include: {
      model: db.Product,
      include: { model: db.ProductImage, attributes: ['id'] },
    },
  },
];

module.exports = { attributesCountStatus, includeOrderCart };
