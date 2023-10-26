const { ResponseError } = require('../../errors');
const { Warehouse } = require('../../models');

async function updateWarehouseActivationByWarehouseId(req) {
  const { action } = req.query;
  const { warehouseId } = req.params;

  const warehouse = await Warehouse.findByPk(warehouseId, { paranoid: false });
  if (!warehouse) throw new ResponseError('warehouse not found', 404);

  if (action === 'activate') await warehouse.restore();
  else if (action === 'deactivate') await warehouse.destroy();
  else throw new ResponseError('invalid action', 400);
}

module.exports = updateWarehouseActivationByWarehouseId;
