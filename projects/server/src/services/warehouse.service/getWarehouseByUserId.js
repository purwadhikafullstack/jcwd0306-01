const { Op } = require('sequelize');
const { Warehouse, WarehouseAddress, Province, City } = require('../../models');

async function getWarehouseByUserId(req) {
  console.log(req.query);
  const warehouses = await Warehouse.findAll({
    where: { id: { [Op.in]: req.query.warehouseId } },
    attributes: ['id'],
    include: [
      {
        model: WarehouseAddress,
        include: [
          { model: Province, attributes: ['name'] },
          { model: City, attributes: ['name'] },
        ],
      },
    ],
    logging: false,
  });
  return warehouses;
}

module.exports = getWarehouseByUserId;
