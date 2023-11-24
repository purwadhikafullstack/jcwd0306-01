const {
  WarehouseUser,
  User,
  Warehouse,
  WarehouseAddress,
  Province,
} = require('../../models');

async function getAllWarehouseAdmin() {
  const result = await WarehouseUser.findAll({
    logging: false,
    include: [
      {
        model: User,
        attributes: ['firstName', 'email', 'id'],
      },
      {
        model: Warehouse,
        attributes: ['name'],
        paranoid: false,
        include: [
          {
            model: WarehouseAddress,
            attributes: ['provinceId'],
            paranoid: false,
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
  return result;
}

module.exports = getAllWarehouseAdmin;
