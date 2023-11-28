const {
  StockMutation,
  Product,
  ProductImage,
  Warehouse,
  WarehouseAddress,
  City,
  Province,
  User,
} = require('../../models');

async function getStockMutationById(req) {
  const { stockMutationId } = req.params;

  const data = await StockMutation.findAll({
    where: { id: stockMutationId },
    include: [
      {
        model: Product,
        paranoid: false,
        attributes: ['id', 'name'],
        include: {
          model: ProductImage,
          attributes: { exclude: ['image'] },
        },
      },
      {
        model: Warehouse,
        paranoid: false,
        as: 'fromWarehouse',
        include: {
          model: WarehouseAddress,
          include: [
            { model: City, attributes: ['name'] },
            { model: Province, attributes: ['name'] },
          ],
        },
      },
      {
        model: Warehouse,
        paranoid: false,
        as: 'toWarehouse',
        include: {
          model: WarehouseAddress,
          include: [
            { model: City, attributes: ['name'] },
            { model: Province, attributes: ['name'] },
          ],
        },
      },
      {
        model: User,
        as: 'requestAdmin',
        attributes: ['firstName', 'lastName'],
      },
      {
        model: User,
        as: 'approveAdmin',
        attributes: ['firstName', 'lastName'],
      },
    ],
  });

  return data;
}

module.exports = getStockMutationById;
