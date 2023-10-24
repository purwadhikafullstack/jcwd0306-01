const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const { User } = require('../../models');
const { sendResponse } = require('../../utils');

async function verifyUserRole({
  decoded,
  isAdmin,
  isWarehouseAdmin,
  isCustomer,
  userId,
}) {
  const userData = await User.findByPk(decoded.id, {
    attributes: ['isAdmin', 'isWarehouseAdmin', 'isCustomer'],
    raw: true,
  });
  if (userId && userData.id !== Number(userId))
    throw new ResponseError('invalid credential', 400);
  if (isAdmin && !!userData.isAdmin) return;
  if (isWarehouseAdmin && !!userData.isWarehouseAdmin) return;
  if (isCustomer && !!userData.isCustomer) return;
  throw new ResponseError('user unauthorized', 401);
}

function verifyAuthUser({
  isAdmin = false,
  isWarehouseAdmin = false,
  isCustomer = false,
}) {
  return async (req, res, next) => {
    try {
      const { userId } = req.params;
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
      await verifyUserRole({
        decoded,
        isAdmin,
        isWarehouseAdmin,
        isCustomer,
        userId,
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
