const cartRouter = require('./cart.route');
const categoryRouter = require('./category.route');
const userRouter = require('./user.route');
const userAddressRouter = require('./userAddress.route');
const provinceRouter = require('./province.route');

const cityRouter = require(`./city.route`);

module.exports = {
  categoryRouter,
  cartRouter,
  userRouter,
  userAddressRouter,
  provinceRouter,
  cityRouter,
};
