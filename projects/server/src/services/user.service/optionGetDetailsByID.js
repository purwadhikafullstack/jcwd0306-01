const db = require('../../models');

const attributesCountStatus = (req) => ({
  include: [
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'verifying' AND userId = ${Number(
          req.params.id
        )} GROUP BY status)`
      ),
      'verifying',
    ],
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'processed' AND userId = ${Number(
          req.params.id
        )} GROUP BY status)`
      ),
      'processed',
    ],
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'shipped' AND userId = ${Number(
          req.params.id
        )} GROUP BY status)`
      ),
      'shipped',
    ],
    [
      db.sequelize.literal(
        `(SELECT COUNT(*) FROM Orders WHERE status = 'received' AND isReadByUser = false AND userId = ${Number(
          req.params.id
        )} GROUP BY status)`
      ),
      'received',
    ],
  ],
});

const includeOrderCart = [
  { model: db.WarehouseUser, paranoid: false },
  {
    model: db.Order,
    as: 'UserOrder',
    where: { status: 'unpaid' },
    attributes: {
      exclude: ['paymentProof', `adminId`],
    },
    required: false,
  },
  {
    model: db.Cart,
    required: false,
    attributes: [
      'productId',
      'quantity',
      'isChecked',
      'note',
      [
        db.sequelize.literal(
          `CAST( 
            ( 
              SELECT IFNULL(SUM(wp.stock), 0) 
              FROM WarehouseProducts AS wp 
              WHERE wp.productId = Carts.productId AND wp.deletedAt IS NULL 
            ) AS SIGNED 
          )`
        ),
        'stock',
      ],
    ],
    include: {
      model: db.Product,
      include: { model: db.ProductImage, attributes: ['id'] },
    },
  },
  {
    model: db.WarehouseUser,
    required: false,
    attributes: ['warehouseId'],
  },
];

module.exports = { attributesCountStatus, includeOrderCart };
