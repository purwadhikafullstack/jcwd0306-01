const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const { User, WarehouseUser, StockMutation, Order } = require('../../models');
const { sendResponse } = require('../../utils');

async function verifyUserRole({
  req,
  decoded,
  isAdmin,
  isWarehouseAdmin,
  isCustomer,
  isVerified,
}) {
  const user = await User.findByPk(decoded.id, {
    attributes: ['id', 'isAdmin', 'isCustomer', 'isVerified'],
    raw: true,
    logging: false,
  });

  if (req.params.userId && Number(req.params.userId) !== user.id)
    throw new ResponseError('Invalid credential', 401);

  // to verify is user a customer
  if (isCustomer && user.isCustomer) {
    // to verify is customer verified
    if (isVerified && !user.isVerified)
      throw new ResponseError('User unverified', 401);
    return;
  }

  // to verify is user a super admin
  if (isAdmin && user.isAdmin) {
    // to verify is super admin verified
    if (isVerified && !user.isVerified)
      throw new ResponseError('User unverified', 401);
    return;
  }

  // to verify is user a warehouse admin
  if (isWarehouseAdmin) {
    const warehouseId = req.params.warehouseId || +req.query.warehouseId;
    // to verify is warehouse admin verified
    if (isVerified && !user.isVerified)
      throw new ResponseError('User unverified', 401);

    const warehouseUser = await WarehouseUser.findOne({
      where: { warehouseAdminId: user.id },
      raw: true,
      logging: false,
    });

    if (!warehouseUser) throw new ResponseError('User unauthorized', 401);

    // to verify warehouse admin by warehouseId
    if (warehouseId && warehouseId === warehouseUser.warehouseId) return;

    // to verify warehouse admin by warehouseId in stockmutation
    if (req.baseUrl === '/stockmutations') {
      const { stockMutationId } = req.params;
      // to verify warehouse admin through stockMutationId
      if (stockMutationId) {
        const stockMutation = await StockMutation.findByPk(stockMutationId, {
          attributes: ['fromWarehouseId', 'toWarehouseId'],
          raw: true,
          logging: false,
        });
        if (!stockMutation)
          throw new ResponseError('Stock mutation not found', 404);
        if (
          warehouseUser.warehouseId === stockMutation.fromWarehouseId ||
          warehouseUser.warehouseId === stockMutation.toWarehouseId
        )
          return;
      }

      // to verify warehouse admin through warehouseId in req.body
      if (
        warehouseUser.warehouseId === req.body.fromWarehouseId ||
        warehouseUser.warehouseId === req.body.toWarehouseId
      )
        return;
    }

    // to verify warehouse admin by warehouseId in order
    if (req.baseUrl === '/order') {
      // to verify warehouse admin through orderId
      const orderId = req.params.id;
      if (orderId) {
        const order = await Order.findByPk(orderId, {
          attributes: ['warehouseId'],
          raw: true,
          logging: false,
        });
        if (!order) throw new ResponseError('Order not found', 404);
        if (warehouseUser.warehouseId === order.warehouseId) return;
      }

      // to verify warehouse admin through warehouseId in req.body
      if (warehouseUser.warehouseId === req.body.warehouseId) return;
    }
  }

  throw new ResponseError('User unauthorized', 401);
}

function verifyAuthUser({
  isAdmin = false,
  isWarehouseAdmin = false,
  isCustomer = false,
  isVerified = false,
  isLogin = false,
}) {
  return async (req, res, next) => {
    try {
      if (isLogin && !req.token) {
        throw new ResponseError('Token not provided', 401);
      }
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

      await verifyUserRole({
        req,
        decoded,
        isAdmin,
        isWarehouseAdmin,
        isCustomer,
        isVerified,
      });
      req.user = decoded;

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError)
        sendResponse({ res, statusCode: 400, error });
      else sendResponse({ res, error });
    }
  };
}

module.exports = verifyAuthUser;
