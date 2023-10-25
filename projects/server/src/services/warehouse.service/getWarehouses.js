const { Warehouse, WarehouseAddress } = require('../../models');

async function getWarehouses() {
  const warehouses = Warehouse.findAll({
    include: [{ model: WarehouseAddress }],
  });
  return warehouses;
}

module.exports = getWarehouses;
