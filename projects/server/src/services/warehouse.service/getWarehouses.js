const { Warehouse, WarehouseAddress, Province, City } = require('../../models');

async function getWarehouses() {
  const warehouses = await Warehouse.findAll({
    paranoid: false,
    include: [
      {
        model: WarehouseAddress,
        include: [{ model: Province }, { model: City }],
        paranoid: false,
      },
    ],
    order: [['updatedAt', 'DESC']],
    logging: false,
  });
  return warehouses;
}

module.exports = getWarehouses;
