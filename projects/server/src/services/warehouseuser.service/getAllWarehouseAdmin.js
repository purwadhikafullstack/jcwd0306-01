const { ResponseError } = require('../../errors');
const { WarehouseUser, User, Warehouse } = require('../../models');

async function getAllWarehouseAdmin() {
  const result = await WarehouseUser.findAll({
    include: [
      {
        model: User,
        attributes: ['firstName'],
      },
      {
        model: Warehouse,
        attributes: ['name'],
      },
    ],
  });
  if (!result) throw new ResponseError('warehouse admin not found', 404);
  console.log(result);
  return result;
}

module.exports = getAllWarehouseAdmin;
