const { ResponseError } = require('../../errors');
const {
  sequelize,
  Sequelize,
  Product,
  ProductCategory,
  WarehouseProduct,
} = require('../../models');
const getProductByProductId = require('./getProductByProductId');

async function activateProduct(product, productId, transaction) {
  await product.restore({ transaction, logging: false });
  await ProductCategory.restore({
    where: { productId },
    transaction,
    logging: false,
  });

  // restore active warehouses only
  const inactiveWarehouses = await product.getWarehouses({
    attributes: ['id'],
    where: { deletedAt: { [Sequelize.Op.not]: null } },
    through: { paranoid: false },
    paranoid: false,
    transaction,
    logging: false,
  });
  const inactiveWarehouseIds = inactiveWarehouses.map((val) =>
    val.getDataValue('id')
  );
  await WarehouseProduct.restore({
    where: {
      productId,
      warehouseId: { [Sequelize.Op.not]: inactiveWarehouseIds },
    },
    transaction,
    logging: false,
  });
}

async function deactivateProduct(product, productId, transaction) {
  await product.destroy({ transaction, logging: false });
  await ProductCategory.destroy({
    where: { productId },
    transaction,
    logging: false,
  });
  await WarehouseProduct.destroy({
    where: { productId },
    transaction,
    logging: false,
  });
}

async function updateProductActivationByProductId(req) {
  const updatedProduct = await sequelize.transaction(
    { logging: false },
    async (t) => {
      const { action } = req.query;
      const { productId } = req.params;
      const product = await Product.findByPk(productId, {
        paranoid: false,
        transaction: t,
        logging: false,
      });
      if (!product) throw new ResponseError('product not found', 404);
      if (action === 'activate') await activateProduct(product, productId, t);
      else if (action === 'deactivate')
        await deactivateProduct(product, productId, t);
      else throw new ResponseError('invalid action', 400);
      const result = await getProductByProductId(productId, t);
      return result;
    }
  );
  return updatedProduct;
}

module.exports = updateProductActivationByProductId;
