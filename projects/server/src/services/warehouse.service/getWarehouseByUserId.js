const { Op } = require('sequelize');
const { Warehouse, WarehouseAddress, Province, City } = require('../../models');

async function getWarehouseByUserId(req) {
  const whId = req.query.warehouseId.map((val) => Number(val));
  const warehouses = await Warehouse.findAll({
    where: { id: { [Op.in]: whId } },
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
    paranoid: false,
    logging: false,
  });
  return warehouses;
}

module.exports = getWarehouseByUserId;
