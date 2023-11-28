const carouselService = require('./carousel.service');
const categoryService = require('./category.service');
const productService = require('./product.service');
const warehouseService = require('./warehouse.service');
const warehouseUserService = require('./warehouseuser.service');
const userService = require('./user.services');
const userAddressService = require('./userAddress.service/userAddress.service');

const orderService = require(`./order.service/order.service`);
const provinceService = require(`./province.service/province.service`);
const cartService = require(`./cart.service/cart.service`);
const cityService = require(`./city.service/city.service`);
const chatService = require(`./chat.service/chat.service`);
const salesReportService = require('./sales.report.service');

module.exports = {
  carouselService,
  categoryService,
  productService,
  warehouseService,
  warehouseUserService,
  userService,
  userAddressService,
  provinceService,
  cartService,
  cityService,
  orderService,
  chatService,
  salesReportService,
};
