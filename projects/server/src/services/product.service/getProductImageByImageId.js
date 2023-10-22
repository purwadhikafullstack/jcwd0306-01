const { ResponseError } = require('../../errors');
const { ProductImage } = require('../../models');

async function getProductImageByImageId(req) {
  const productImage = await ProductImage.findByPk(req.params.imageId, {
    attributes: ['image'],
    raw: true,
  });
  if (!productImage?.image)
    throw new ResponseError('product image not found', 404);
  return productImage.image;
}

module.exports = getProductImageByImageId;
