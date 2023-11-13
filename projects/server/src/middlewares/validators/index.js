const carouselValidator = require('./carousel.validator');
const categoryValidator = require('./category.validator');
const productValidator = require('./product.validator');
const warehouseValidator = require('./warehouse.validator');
const warehouseUserValidator = require('./warehouseuser.validator');
const addressValidator = require('./userAddressValidator');
const orderValidator = require('./order.validator');
const stockMutationValidator = require('./stockmutation.validator');

module.exports = {
  carouselValidator,
  categoryValidator,
  productValidator,
  warehouseValidator,
  warehouseUserValidator,
  addressValidator,
  orderValidator,
  stockMutationValidator,
};
