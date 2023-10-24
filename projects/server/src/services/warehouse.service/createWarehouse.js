const { sequelize, Warehouse, WarehouseAddress } = require('../../models');

async function createWarehouse(req) {
  const warehouse = await sequelize.transaction(async (t) => {
    const data = await Warehouse.create(req.body, {
      fields: ['name'],
      transaction: t,
    });
    await data.createWarehouseAddress(req.body, {
      fields: [
        'country',
        'provinceId',
        'cityId',
        'district',
        'village',
        'detail',
        'longitude',
        'latitude',
      ],
      transaction: t,
    });
    const result = await Warehouse.findByPk(data.getDataValue('id'), {
      include: [{ model: WarehouseAddress }],
      transaction: t,
    });
    return result.toJSON();
  });
  return warehouse;
}

module.exports = createWarehouse;
