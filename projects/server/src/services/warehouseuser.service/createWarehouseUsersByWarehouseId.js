const { ResponseError } = require('../../errors');
const { sequelize, Warehouse, WarehouseUser, User } = require('../../models');
const { findUser } = require('../user.services');

async function createWarehouseUsersByWarehouseId(req) {
  const { email } = req.body;

  if (!email) {
    throw new ResponseError('Email is required!', 400);
  }

  const data = await sequelize.transaction(async (t) => {
    const warehouse = await Warehouse.findByPk(req.params.warehouseId, {
      transaction: t,
      logging: false,
    });

    if (!warehouse) {
      throw new ResponseError('Warehouse not found', 404);
    }

    const user = await findUser(email, { transaction: t });

    if (!user) {
      throw new ResponseError('User not found', 404);
    }

    await WarehouseUser.create(
      {
        warehouseId: req.params.warehouseId,
        warehouseAdminId: user.id,
      },
      { transaction: t }
    );

    const result = await Warehouse.findByPk(req.params.warehouseId, {
      include: [
        {
          model: WarehouseUser,
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
