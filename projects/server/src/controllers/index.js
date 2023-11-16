const carouselController = require('./carousel.controller');
const categoryController = require('./category.controller');
const productController = require('./product.controller');
const warehouseController = require('./warehouse.controller');
const warehouseUserController = require('./warehouseuser.controller');
const CartController = require('./cart.controller');
const userController = require('./user.controller');
const UserAddressController = require('./userAddress.controller');

const ProvinceController = require(`./province.controller`);
const CityController = require(`./city.controller`);
const OrderController = require('./order.controller');
const ChatController = require('./chat.controller');

module.exports = {
  carouselController,
  categoryController,
  productController,
  warehouseController,
  warehouseUserController,
  CartController,
  userController,
  UserAddressController,
  ProvinceController,
  CityController,
  OrderController,
  ChatController,
};
