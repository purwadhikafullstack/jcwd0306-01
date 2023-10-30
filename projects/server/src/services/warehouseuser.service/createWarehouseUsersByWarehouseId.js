const { ResponseError } = require('../../errors');
const { sequelize, Warehouse, WarehouseUser } = require('../../models');

async function createWarehouseUsersByWarehouseId(req) {
  const warehouse = await sequelize.transaction(async (t) => {
    const data = await Warehouse.findByPk(req.params.warehouseId, {
      transaction: t,
    });
    if (!data) throw new ResponseError('warehouse not found', 404);
    await data.addUsers(req.body.userIds, { transaction: t });
    const result = await Warehouse.findByPk(req.params.warehouseId, {
      include: [{ model: WarehouseUser }],
      transaction: t,
    });
    return result.toJSON();
  });
  return warehouse;
}

module.exports = createWarehouseUsersByWarehouseId;
