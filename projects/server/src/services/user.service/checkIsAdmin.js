const db = require('../../models');

const checkIsAdmin = async (user) => {
  if (user.dataValues.isAdmin) {
    const result = await db.Warehouse.findAll({
      logging: false,
      attributes: ['id'],
    });
    user.setDataValue(
      'WarehouseUsers',
      result.map((whse) => ({ warehouseId: whse.dataValues.id }))
    );
  }
};

module.exports = checkIsAdmin;
