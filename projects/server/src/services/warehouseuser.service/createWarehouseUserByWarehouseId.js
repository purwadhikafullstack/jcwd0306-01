const { ResponseError } = require('../../errors');
const { sequelize, Warehouse, WarehouseUser } = require('../../models');

async function createWarehouseUserByWarehouseId(req) {
  const warehouseuser = await sequelize.transaction(async (t) => {
    const warehouse = await Warehouse.findByPk(req.params.warehouseId, {
      transaction: t,
    });
    if (!warehouse) throw new ResponseError('warehouse not found', 404);
    await warehouse.addUsers(req.body.userIds, { transaction: t });
    const result = await Warehouse.findByPk(req.params.warehouseId, {
      include: [{ model: WarehouseUser }],
      transaction: t,
    });
    return result.toJSON();
  });
  return warehouseuser;
}

module.exports = createWarehouseUserByWarehouseId;
