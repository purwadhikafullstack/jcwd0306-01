const carouselValidator = require('./carousel.validator');
const categoryValidator = require('./category.validator');
const productValidator = require('./product.validator');

const addressValidator = require(`./userAddressValidator`);

module.exports = {
  carouselValidator,
  categoryValidator,
  addressValidator,
  productValidator,
};
