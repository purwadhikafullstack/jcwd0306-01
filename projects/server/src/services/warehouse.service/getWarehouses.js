const { Warehouse, WarehouseAddress, Province, City } = require('../../models');

async function getWarehouses() {
  const warehouses = Warehouse.findAll({
    include: [
      {
        model: WarehouseAddress,
        include: [{ model: Province }, { model: City }],
      },
    ],
  });
  return warehouses;
}

module.exports = getWarehouses;
