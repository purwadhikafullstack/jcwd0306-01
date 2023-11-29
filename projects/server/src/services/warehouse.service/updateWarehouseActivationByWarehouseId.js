const { ResponseError } = require('../../errors');
const {
  sequelize,
  Sequelize,
  Warehouse,
  WarehouseAddress,
  WarehouseUser,
  WarehouseProduct,
} = require('../../models');

async function activateWarehouse(warehouse, warehouseId, transaction) {
  await warehouse.restore({ transaction, logging: false });
  await WarehouseAddress.restore({
    where: { warehouseId },
    transaction,
    logging: false,
  });
  await WarehouseUser.restore({
    where: { warehouseId },
    transaction,
    logging: false,
  });

  // restore active products only
  const inactiveProducts = await warehouse.getProducts({
    attributes: ['id'],
    where: { deletedAt: { [Sequelize.Op.not]: null } },
    through: { paranoid: false },
    paranoid: false,
    transaction,
    logging: false,
  });
  const inactiveProductIds = inactiveProducts.map((val) =>
    val.getDataValue('id')
  );
  await WarehouseProduct.restore({
    where: {
      warehouseId,
      productId: { [Sequelize.Op.not]: inactiveProductIds },
    },
    transaction,
    logging: false,
  });
}

async function deactivateWarehouse(warehouse, warehouseId, transaction) {
  await warehouse.destroy({ transaction, logging: false });
  await WarehouseAddress.destroy({
    where: { warehouseId },
    transaction,
    logging: false,
  });
  await WarehouseUser.destroy({
    where: { warehouseId },
    transaction,
    logging: false,
  });
  await WarehouseProduct.destroy({
    where: { warehouseId },
    transaction,
    logging: false,
  });
}

async function updateWarehouseActivationByWarehouseId(req) {
  const wh = await sequelize.transaction({ logging: false }, async (t) => {
    const { action } = req.query;
    const { warehouseId } = req.params;
    const warehouse = await Warehouse.findByPk(warehouseId, {
      paranoid: false,
      transaction: t,
      logging: false,
    });
    if (!warehouse) throw new ResponseError('warehouse not found', 404);
    if (action === 'activate')
      await activateWarehouse(warehouse, warehouseId, t);
    else if (action === 'deactivate')
      await deactivateWarehouse(warehouse, warehouseId, t);
    else throw new ResponseError('invalid action', 400);
    return warehouse.toJSON();
  });
  return wh;
}

module.exports = updateWarehouseActivationByWarehouseId;
