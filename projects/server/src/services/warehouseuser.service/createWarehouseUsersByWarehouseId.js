const { ResponseError } = require('../../errors');
const { sequelize, Warehouse, WarehouseUser, User } = require('../../models');
const { findUser } = require('../user.services');

async function createWarehouseUsersByWarehouseId(req) {
  const { email } = req.body;
  if (!email) {
    throw new ResponseError('Email is required!', 400);
  }
  if (!req.params.warehouseId)
    throw new ResponseError('warehouse Id not included!', 400);

  const user = await findUser(email, ['image']);

  if (!user) {
    throw new ResponseError('User not found', 404);
  }

  // 1 user tidak bisa menjadi admin lebih dari 1 warehouse
  // kalau sudah ada id nya di table WarehouseUsers throw new Error

  // bawah: 1 user tidak bisa di post di warehouse yg sama
  const existingWarehouseUser = await WarehouseUser.findOne({
    paranoid: false,
    where: {
      warehouseId: req.params.warehouseId,
      warehouseAdminId: user.id,
    },
    raw: true,
    logging: false,
  });
  if (existingWarehouseUser) {
    throw new ResponseError('User already exists for this warehouse', 400);
  }

  const existingAdmin = await WarehouseUser.findOne({
    paranoid: false,
    where: {
      warehouseAdminId: user.id,
    },
    logging: false,
  });
  if (existingAdmin)
    throw new ResponseError('User Already a Warehouse Admin', 400);

  const data = await sequelize.transaction(async (t) => {
    const warehouse = await Warehouse.findByPk(req.params.warehouseId, {
      paranoid: false,
      transaction: t,
      logging: false,
    });

    if (!warehouse) {
      throw new ResponseError('Warehouse not found', 404);
    }

    await WarehouseUser.create(
      {
        warehouseId: req.params.warehouseId,
        warehouseAdminId: user.id,
      },
      { paranoid: false, transaction: t }
    );

    const result = await Warehouse.findByPk(req.params.warehouseId, {
      paranoid: false,
      include: [
        {
          model: WarehouseUser,
          paranoid: false,
          include: [
            {
              model: User,
              attributes: [
                'id',
                'firstName',
                'lastName',
                'createdAt',
                'updatedAt',
              ],
            },
          ],
        },
      ],
      transaction: t,
      logging: false,
    });

    return result.toJSON();
  });

  return data;
}

module.exports = createWarehouseUsersByWarehouseId;
