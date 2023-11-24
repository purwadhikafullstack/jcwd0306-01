const { ResponseError } = require('../../errors');
const { sequelize, Product } = require('../../models');

const IMAGEIDS_QUERY = sequelize.literal(
  '(SELECT JSON_ARRAYAGG(pi.id) FROM ProductImages AS pi WHERE pi.productId = Product.id)'
);
const SOLD_QUERY = sequelize.literal(
  `CAST(
    IFNULL((
      SELECT 
        IFNULL(SUM(op.quantity), 0) AS sold 
      FROM OrderProducts op 
      LEFT JOIN Orders o ON o.id = op.orderId 
      WHERE o.status IN ('processed', 'shipped', 'received') AND op.productId = Product.id
      GROUP BY op.productId 
    ), 0) AS SIGNED
  )`
);
const STOCK_QUERY = sequelize.literal(
  `CAST( 
    ( 
      SELECT IFNULL(SUM(wp.stock), 0) 
      FROM WarehouseProducts AS wp 
      WHERE wp.productId = Product.id AND wp.deletedAt IS NULL 
    ) AS SIGNED 
  )`
);
const INACTIVE_STOCK_QUERY = sequelize.literal(
  `CAST( 
    ( 
      SELECT IFNULL(SUM(wp.stock), 0) 
      FROM WarehouseProducts AS wp 
      WHERE wp.productId = Product.id AND wp.deletedAt IS NOT NULL 
    ) AS SIGNED 
  )`
);
const CATEGORIES_QUERY = sequelize.literal(
  `( 
    SELECT Categories 
    FROM ( 
      SELECT 
        p.id AS productId, 
        CASE 
          WHEN c.id IS NULL 
          THEN JSON_ARRAY() 
          ELSE JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name)) 
        END AS Categories 
      FROM Products p 
      LEFT JOIN ProductCategories pc ON p.id = pc.productId 
      LEFT JOIN Categories c ON pc.categoryId = c.id 
      GROUP BY p.id 
    ) c 
    WHERE c.productId = Product.id 
  )`
);
const WAREHOUSEPRODUCTS_QUERY = sequelize.literal(
  `( 
    SELECT WarehouseProducts 
    FROM ( 
      SELECT
        p.id AS productId,
        JSON_ARRAYAGG(
          JSON_OBJECT('warehouseId', wp.warehouseId, 'name', w.name, 'city', c.name, 'stock', wp.stock)
        ) AS WarehouseProducts 
      FROM Products p 
      LEFT JOIN WarehouseProducts wp ON p.id = wp.productId 
      LEFT JOIN Warehouses w ON wp.warehouseId = w.id 
      LEFT JOIN WarehouseAddresses wa ON w.id = wa.warehouseId 
      LEFT JOIN Cities c ON wa.cityId = c.id 
      GROUP BY p.id 
    ) wp 
    WHERE wp.productId = Product.id 
  )`
);

async function getProductByProductId(productId, transaction) {
  const product = await Product.findByPk(productId, {
    paranoid: false,
    logging: false,
    transaction,
    attributes: {
      include: [
        [SOLD_QUERY, 'sold'],
        [STOCK_QUERY, 'stock'],
        [INACTIVE_STOCK_QUERY, 'inactiveStock'],
        [IMAGEIDS_QUERY, 'imageIds'],
        [CATEGORIES_QUERY, 'Categories'],
        [WAREHOUSEPRODUCTS_QUERY, 'WarehouseProducts'],
      ],
    },
  });
  if (!product) throw new ResponseError('product not found', 404);
  return product;
}

module.exports = getProductByProductId;
