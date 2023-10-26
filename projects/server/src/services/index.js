const carouselService = require('./carousel.service');
const categoryService = require('./category.service');
const productService = require('./product.service');
const warehouseService = require('./warehouse.service');
const warehouseUserService = require('./warehouseuser.service');
const userService = require('./user.services');
const UserAddressService = require('./userAddress.service/userAddress.service');

const OrderService = require(`./order.service/order.service`);
const ProvinceService = require(`./province.service/province.service`);
const CartService = require(`./cart.service/cart.service`);
const CityService = require(`./city.service/city.service`);

module.exports = {
  carouselService,
  categoryService,
  productService,
  warehouseService,
  warehouseUserService,
  userService,
  UserAddressService,
  ProvinceService,
  CartService,
  CityService,
  OrderService,
};
