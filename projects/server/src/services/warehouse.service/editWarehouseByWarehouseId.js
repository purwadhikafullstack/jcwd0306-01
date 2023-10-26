const { ResponseError } = require('../../errors');
const {
  sequelize,
  Warehouse,
  WarehouseAddress,
  Province,
  City,
} = require('../../models');

async function editWarehouse(warehouseId, values, transaction) {
  await Warehouse.update(values, {
    where: { id: warehouseId },
    fields: ['name'],
    transaction,
  });
}

async function editWarehouseAddress(warehouseId, values, transaction) {
  await WarehouseAddress.update(values, {
    where: { warehouseId },
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
  });
}

async function editWarehouseByWarehouseId(req) {
  const warehouse = await sequelize.transaction(async (t) => {
    const { warehouseId } = req.params;
    await editWarehouse(warehouseId, req.body, t);
    await editWarehouseAddress(warehouseId, req.body, t);
    const result = await Warehouse.findByPk(warehouseId, {
      include: [
        {
          model: WarehouseAddress,
          include: [{ model: Province }, { model: City }],
        },
      ],
      transaction: t,
    });
    if (!result) throw new ResponseError('warehouse not found', 404);
    return result.toJSON();
  });
  return warehouse;
}

module.exports = editWarehouseByWarehouseId;
