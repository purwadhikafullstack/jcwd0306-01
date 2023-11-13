const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const { User, WarehouseUser, StockMutation } = require('../../models');
const { sendResponse } = require('../../utils');

async function verifyUserRole({
  decoded,
  isAdmin,
  isWarehouseAdmin,
  isCustomer,
  isVerified,
  userId,
  warehouseId,
  stockMutationId,
}) {
  const user = await User.findByPk(decoded.id, {
    attributes: ['id', 'isAdmin', 'isCustomer', 'isVerified'],
    raw: true,
    logging: false,
  });

  if (userId && user.id !== Number(userId))
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
  if (isWarehouseAdmin && (warehouseId || stockMutationId)) {
    // to verify is warehouse admin verified
    if (isVerified && !user.isVerified)
      throw new ResponseError('User unverified', 401);

    const warehouseUser = await WarehouseUser.findOne({
      where: { warehouseAdminId: user.id },
      raw: true,
    });

    // to verify warehouseAdmin by warehouseId
    if (warehouseId && warehouseUser) {
      if (warehouseId === warehouseUser.warehouseId) return;
    }

    // to verify warehouseAdmin by warehouseId in stokmutation
    if (stockMutationId && warehouseUser) {
      const stockMutation = await StockMutation.findByPk(stockMutationId, {
        attributes: ['fromWarehouseId', 'toWarehouseId'],
        raw: true,
      });
      if (!stockMutation)
        throw new ResponseError('Stock mutation not found', 404);
      if (
        warehouseUser.warehouseId === stockMutation.fromWarehouseId ||
        warehouseUser.warehouseId === stockMutation.toWarehouseId
      )
        return;
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
      const { userId, warehouseId, stockMutationId } = req.params;
      if (isLogin && !req.token) {
        throw new ResponseError('Token not provided', 401);
      }
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
      await verifyUserRole({
        decoded,
        isAdmin,
        isWarehouseAdmin,
        isCustomer,
        isVerified,
        userId,
        warehouseId,
        stockMutationId,
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
