const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const { User } = require('../../models');
const { sendResponse } = require('../../utils');

async function verifyUserRole({
  err,
  decoded,
  isAdmin,
  isWarehouseAdmin,
  isCustomer,
  idParams,
  userId,
}) {
  if (err) throw new ResponseError(err, 401);
  const userData = await User.findByPk(decoded.id, {
    attributes: ['isAdmin', 'isWarehouseAdmin', 'isCustomer'],
  });
  if (idParams && userData?.id !== Number(userId))
    throw new ResponseError('invalid credential', 400);
  if (isAdmin && userData?.isAdmin) return;
  if (isWarehouseAdmin && userData?.isWarehouseAdmin) return;
  if (isCustomer && userData?.isCustomer) return;
  throw new ResponseError('user unauthorized', 401);
}

function verifyAuthUser({
  isAdmin = false,
  isWarehouseAdmin = false,
  isCustomer = false,
  idParams = false,
}) {
  return async (req, res, next) => {
    try {
      const { userId } = req.params;
      await jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, decoded) =>
        verifyUserRole({
          err,
          decoded,
          isAdmin,
          isWarehouseAdmin,
          isCustomer,
          idParams,
          userId,
        })
      );

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  };
}

module.exports = verifyAuthUser;
