const categoryService = require('./category.service');
const userService = require('./user.services');
const UserAddressService = require('./userAddress.service/userAddress.service');

const ProvinceService = require(`./province.service/province.service`);
const CartService = require(`./cart.service/cart.service`);
const CityService = require(`./city.service/city.service`);

module.exports = {
  categoryService,
  userService,
  UserAddressService,
  ProvinceService,
  CartService,
  CityService,
};
