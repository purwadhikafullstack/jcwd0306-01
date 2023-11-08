const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const { User, WarehouseUser } = require('../../models');
const { sendResponse } = require('../../utils');

async function verifyUserRole({
  decoded,
  isAdmin,
  isWarehouseAdmin,
  isCustomer,
  isVerified,
  userId,
  warehouseId,
}) {
  const user = await User.findByPk(decoded.id, {
    attributes: ['id', 'isAdmin', 'isCustomer', 'isVerified'],
    raw: true,
    logging: false,
  });

  if (userId && user.id !== Number(userId))
    throw new ResponseError('Invalid credential', 401);

  if (isCustomer && user.isCustomer) {
    if (isVerified && !user.isVerified)
      throw new ResponseError('User unverified', 401);
    return;
  }

  if (isAdmin && user.isAdmin) {
    if (isVerified && !user.isVerified)
      throw new ResponseError('User unverified', 401);
    return;
  }

  if (isWarehouseAdmin && warehouseId) {
    if (isVerified && !user.isVerified)
      throw new ResponseError('User unverified', 401);

    const warehouseUser = await WarehouseUser.findOne({
      where: { warehouseId, warehouseAdminId: user.id },
    });
    if (warehouseUser) return;
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
      const { userId, warehouseId } = req.params;
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
