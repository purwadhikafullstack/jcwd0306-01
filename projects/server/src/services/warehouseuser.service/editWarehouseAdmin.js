const { findUser } = require('../user.services');
const { Warehouse, WarehouseUser } = require('../../models');
const { ResponseError } = require('../../errors');

async function editWarehouseAdmin(req) {
  const { whAdminEmail } = req.body;
  const { whId } = req.params;

  if (!whId) throw new ResponseError('Warehouse Id not included!');

  const user = await findUser(whAdminEmail, [
    'image',
    'isVerified',
    'forget_password_token',
  ]);
  const warehouse = await Warehouse.findByPk(whId, { paranoid: false });
  if (!warehouse) throw new ResponseError('Warehouse Not Found!', 404);

  // Check if the user is already assigned as an admin for this warehouse
  const existingWarehouseUser = await WarehouseUser.findOne({
    paranoid: false,
    where: {
      warehouseId: warehouse.id,
      warehouseAdminId: user.id,
    },
    raw: true,
  });

  if (existingWarehouseUser) {
    throw new ResponseError('User is already an admin for this warehouse', 400);
  }

  await WarehouseUser.update(
    {
      warehouseId: warehouse.id,
    },
    {
      paranoid: false,
      where: {
        warehouseAdminId: user.id,
      },
    }
  );

  return { user, warehouse };
}

module.exports = editWarehouseAdmin;
