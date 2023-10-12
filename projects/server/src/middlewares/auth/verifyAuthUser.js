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
}) {
  if (err) throw new ResponseError(err, 401);
  const userData = await User.findByPk(decoded.id, {
    attributes: ['isAdmin', 'isWarehouseAdmin', 'isCustomer'],
  });
  if (isAdmin && userData?.isAdmin) return;
  if (isWarehouseAdmin && userData?.isWarehouseAdmin) return;
  if (isCustomer && userData?.isCustomer) return;
  throw new ResponseError('user unauthorized', 401);
}

function verifyUserAuth({
  isAdmin = false,
  isWarehouseAdmin = false,
  isCustomer = false,
}) {
  return async (req, res, next) => {
    try {
      await jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, decoded) =>
        verifyUserRole({ err, decoded, isAdmin, isWarehouseAdmin, isCustomer })
      );
      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  };
}

module.exports = verifyUserAuth;
