const { ResponseError } = require('../../errors');
const getStockMutationByStockMutationId = require('./getStockMutationByStockMutationId');

async function deleteStockMutationByStockMutationId(req) {
  const stockMutation = await getStockMutationByStockMutationId(
    req.params.stockMutationId
  );
  if (stockMutation.getDataValue('status') !== 'requested')
    throw new ResponseError(
      'Stock mutation can be deleted only if current status="requested"',
      400
    );
  await stockMutation.destroy({ logging: false });
}

module.exports = deleteStockMutationByStockMutationId;
