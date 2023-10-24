const carouselController = require('./carousel.controller');
const CartController = require('./cart.controller');
const categoryController = require('./category.controller');
const productController = require('./product.controller');
const warehouseController = require('./warehouse.controller');
const userController = require('./user.controller');
const UserAddressController = require('./userAddress.controller');

const ProvinceController = require(`./province.controller`);
const CityController = require(`./city.controller`);

module.exports = {
  carouselController,
  CartController,
  categoryController,
  productController,
  warehouseController,
  userController,
  UserAddressController,
  ProvinceController,
  CityController,
};
