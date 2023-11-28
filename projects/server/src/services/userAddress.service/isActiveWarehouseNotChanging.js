const db = require('../../models');

const isActiveWarehouseNotChanging = async (client) => {
  const key = `allWarehouses`;
  const whse = await db.Warehouse.findAll({
    attributes: ['id'],
    logging: false,
  });
  const allActiveWarehouse = JSON.stringify(
    whse.map(({ dataValues }) => dataValues.id)
  );
  const resultWarehouses = await client.v4.get(key);
  if (!resultWarehouses || resultWarehouses !== allActiveWarehouse) {
    await client.set(key, allActiveWarehouse);
    return false;
  }
  if (resultWarehouses === allActiveWarehouse) return true;

  return false;
};

module.exports = isActiveWarehouseNotChanging;
