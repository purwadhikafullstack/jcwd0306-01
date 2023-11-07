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
    throw new ResponseError('invalid credential', 400);

  if (isVerified && !user.isVerified)
    throw new ResponseError('user unverified', 400);

  if (isCustomer && user.isCustomer) return;

  if (isAdmin && user.isAdmin) return;

  if (isWarehouseAdmin && warehouseId) {
    const warehouseUser = await WarehouseUser.findOne({
      where: { warehouseId, warehouseAdminId: user.id },
      raw: true,
    });
    if (warehouseUser) return;
  }

  throw new ResponseError('user unauthorized', 401);
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
        throw new ResponseError('token not provided', 401);
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
