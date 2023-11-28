const { Warehouse, WarehouseAddress, Province, City } = require('../../models');

async function getWarehouseByName(warehouseName) {
  const warehouse = await Warehouse.findOne({
    paranoid: false,
    where: { name: warehouseName },
    include: [
      {
        model: WarehouseAddress,
        include: [{ model: Province }, { model: City }],
        paranoid: false,
      },
    ],
    logging: false,
  });

  if (!warehouse) throw new Error('Warehouse Not Found');
  return warehouse;
}

module.exports = getWarehouseByName;
