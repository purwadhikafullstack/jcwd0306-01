const carouselController = require('./carousel.controller');
const CartController = require('./cart.controller');
const categoryController = require('./category.controller');
const productController = require('./product.controller');
const userController = require('./user.controller');
const UserAddressController = require('./userAddress.controller');

const ProvinceController = require(`./province.controller`);
const CityController = require(`./city.controller`);
const OrderController = require('./order.controller');

module.exports = {
  carouselController,
  CartController,
  categoryController,
  productController,
  userController,
  UserAddressController,
  ProvinceController,
  CityController,
  OrderController,
};
