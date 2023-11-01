const { ResponseError } = require('../../errors');
const {
  sequelize,
  Warehouse,
  WarehouseAddress,
  Province,
  City,
} = require('../../models');

async function addWarehouse(values, transaction) {
  const [warehouse, isCreated] = await Warehouse.findOrCreate({
    where: { name: values.name },
    defaults: values,
    logging: false,
    fields: ['name'],
    transaction,
  });
  if (!isCreated) throw new ResponseError('warehouse name already exist', 400);
  return warehouse;
}

async function addWarehouseAddress(warehouse, values, transaction) {
  await warehouse.createWarehouseAddress(values, {
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
    transaction,
    logging: false,
  });
}

async function createWarehouse(req) {
  const warehouse = await sequelize.transaction(async (t) => {
    const data = await addWarehouse(req.body, t);
    await addWarehouseAddress(data, req.body, t);
    const result = await Warehouse.findByPk(data.getDataValue('id'), {
      include: [
        {
          model: WarehouseAddress,
          include: [{ model: Province }, { model: City }],
        },
      ],
      transaction: t,
      logging: false,
    });
    return result.toJSON();
  });
  return warehouse;
}

module.exports = createWarehouse;
