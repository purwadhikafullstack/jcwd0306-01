const { ResponseError } = require('../../errors');
const {
  WarehouseUser,
  User,
  Warehouse,
  WarehouseAddress,
  Province,
} = require('../../models');

async function getAllWarehouseAdmin() {
  const result = await WarehouseUser.findAll({
    include: [
      {
        model: User,
        attributes: ['firstName', 'email', 'id'],
      },
      {
        model: Warehouse,
        attributes: ['name'],
        include: [
          {
            model: WarehouseAddress,
            attributes: ['provinceId'],
            include: [
              {
                model: Province,
                attributes: ['name'],
              },
            ],
          },
        ],
      },
    ],
  });
  if (!result) throw new ResponseError('warehouse admin not found', 404);
  return result;
}

module.exports = getAllWarehouseAdmin;
