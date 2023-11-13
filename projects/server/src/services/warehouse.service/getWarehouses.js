const { Warehouse, WarehouseAddress, Province, City } = require('../../models');

async function getWarehouses() {
  const warehouses = await Warehouse.findAll({
    paranoid: false,
    include: [
      {
        model: WarehouseAddress,
        include: [{ model: Province }, { model: City }],
      },
    ],
    order: [['updatedAt', 'DESC']],
  });
  return warehouses;
}

module.exports = getWarehouses;
