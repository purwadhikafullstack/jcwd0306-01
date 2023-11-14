const { WarehouseUser } = require('../../models');

async function deleteWarehouseUsersByWarehouseId(req) {
  await WarehouseUser.destroy({
    where: {
      warehouseId: req.params.warehouseId,
      warehouseAdminId: req.body.userIds,
    },
    logging: false,
    force: true,
  });
}

module.exports = deleteWarehouseUsersByWarehouseId;
