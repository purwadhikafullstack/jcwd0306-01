const { ResponseError } = require('../../errors');
const { sequelize, Product } = require('../../models');
const getProductByProductId = require('./getProductByProductId');

async function checkProductNameUniqueness(req, transaction) {
  const product = await Product.findOne({
    where: { name: req.body.name },
    transaction,
  });
  if (product && product.getDataValue('id') !== +req.params.productId)
    throw new ResponseError('product name already exist', 400);
}

async function updateProduct(req, transaction) {
  const [numUpdatedProduct] = await Product.update(req.body, {
    where: { id: req.params.productId },
    fields: ['name', 'description', 'price', 'weight', 'discount'],
    transaction,
  });
  if (numUpdatedProduct === 0)
    throw new ResponseError('product not found', 404);
}

async function updateProductCategories(req, transaction) {
  const product = await Product.findByPk(req.params.productId, { transaction });
  await product.setCategories(req.body.categoryIds, { transaction });
}

async function editProductByProductId(req) {
  const product = await sequelize.transaction(async (t) => {
    if (req.body.name) await checkProductNameUniqueness(req, t);
    await updateProduct(req, t);
    if (req.body.categoryIds) await updateProductCategories(req, t);
    const data = await getProductByProductId(req, t);
    return data;
  });
  return product;
}

module.exports = editProductByProductId;
