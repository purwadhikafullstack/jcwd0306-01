const { ResponseError } = require('../../errors');
const { sequelize, Product, ProductImage } = require('../../models');
const getProductByProductId = require('./getProductByProductId');

async function checkProductNameUniqueness(req, transaction) {
  const product = await Product.findOne({
    where: { name: req.body.name },
    paranoid: false,
    transaction,
  });
  if (product && product.getDataValue('id') !== +req.params.productId)
    throw new ResponseError('product name already exist', 400);
}

async function updateProduct(req, transaction) {
  await Product.update(req.body, {
    where: { id: req.params.productId },
    fields: ['name', 'description', 'price', 'weight', 'discount'],
    paranoid: false,
    transaction,
  });
}

async function updateProductCategories(req, transaction) {
  const product = await Product.findByPk(req.params.productId, {
    paranoid: false,
    transaction,
  });
  await product.setCategories(req.body.categoryIds, {
    force: true,
    paranoid: false,
    transaction,
  });
}

async function updateProductImages(req, transaction) {
  const product = await Product.findByPk(req.params.productId, {
    paranoid: false,
    transaction,
  });
  await Promise.all(
    req.body.images.map((image) =>
      product.createProductImage({ image }, { transaction })
    )
  );
}

async function deleteProductImages(req, transaction) {
  await ProductImage.destroy({
    where: { id: req.body.imageIdsToDelete },
    transaction,
  });
}

async function checkProductImages(req, transaction) {
  const productImages = await ProductImage.findAll({
    attributes: ['id'],
    where: { productId: req.params.productId },
    transaction,
  });
  if (productImages.length < 1)
    throw new ResponseError('Product must have at least one image', 400);
}

async function editProductByProductId(req) {
  const product = await sequelize.transaction(async (t) => {
    if (req.body.name) await checkProductNameUniqueness(req, t);
    await updateProduct(req, t);
    if (req.body.categoryIds) await updateProductCategories(req, t);
    if (req.body.images && req.body.images.length !== 0)
      await updateProductImages(req, t);
    if (req.body.imageIdsToDelete && req.body.imageIdsToDelete.length !== 0)
      await deleteProductImages(req, t);
    await checkProductImages(req, t);
    const result = await getProductByProductId(req.params.productId, t);
    return result;
  });
  return product;
}

module.exports = editProductByProductId;
