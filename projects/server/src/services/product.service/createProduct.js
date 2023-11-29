const { ResponseError } = require('../../errors');
const { sequelize, Product, Warehouse } = require('../../models');
const getProductByProductId = require('./getProductByProductId');

async function addProduct(values, transaction) {
  const { name, description, price, weight, discount } = values;
  const [product, isCreated] = await Product.findOrCreate({
    where: { name },
    defaults: { name, description, price, weight, discount },
    paranoid: false,
    transaction,
    logging: false,
  });
  if (!isCreated) throw new ResponseError('Product name already exist', 400);
  return product;
}

async function addProductCategories(product, values, transaction) {
  const { categoryIds } = values;
  await product.setCategories(categoryIds, { transaction, logging: false });
}

async function addProductImages(product, values, transaction) {
  await Promise.all(
    values.images.map((image) =>
      product.createProductImage({ image }, { transaction, logging: false })
    )
  );
}

async function addProductWarehouses(product, transaction) {
  const warehouses = await Warehouse.findAll({
    paranoid: false,
    transaction,
    logging: false,
  });
  if (warehouses.length !== 0) {
    await product.setWarehouses(warehouses, {
      through: { stock: 0 },
      paranoid: false,
      transaction,
      logging: false,
    });
  }
}

async function createProduct(req) {
  const product = await sequelize.transaction({ logging: false }, async (t) => {
    const data = await addProduct(req.body, t);
    if (req.body.categoryIds) await addProductCategories(data, req.body, t);
    await addProductImages(data, req.body, t);
    await addProductWarehouses(data, t);
    const result = await getProductByProductId(data.getDataValue('id'), t);
    return result;
  });
  return product;
}

module.exports = createProduct;
