const db = require('../../models');

const isActiveWarehouseNotChanging = async (client) => {
  const key = `allWarehouses`;
  const whse = await db.Warehouse.findAll({
    attributes: ['id'],
    logging: false,
  });
  const allActiveWarehouse = whse.map(({ dataValues }) => dataValues.id);
  const resultWarehouses = await client.v4.get(key);
  if (!resultWarehouses) {
    await client.set(key, JSON.stringify(allActiveWarehouse));
    return false;
  }
  if (resultWarehouses === JSON.stringify(allActiveWarehouse)) return true;

  return false;
};

module.exports = isActiveWarehouseNotChanging;
