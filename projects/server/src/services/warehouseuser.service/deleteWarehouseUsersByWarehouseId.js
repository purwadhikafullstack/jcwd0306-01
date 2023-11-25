const { WarehouseUser } = require('../../models');

async function deleteWarehouseUsersByWarehouseId(req) {
  await WarehouseUser.destroy({
    force: true,
    paranoid: false,
    where: {
      warehouseId: req.params.warehouseId,
      warehouseAdminId: req.body.userIds,
    },
    logging: false,
  });
}

module.exports = deleteWarehouseUsersByWarehouseId;
