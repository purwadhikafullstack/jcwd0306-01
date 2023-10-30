const { ResponseError } = require('../../errors');
const { sendResponse } = require('../../utils');

const quantityValidator = (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { values } = req.body;
    if (values.length > 20)
      throw new ResponseError('Number of item in cart reach limit (20)', 400);
    values.forEach((product) => {
      if (product.quantity < 1)
        throw new ResponseError(`quantity cannot be less than 0`, 400);
      product.userId = userId;
    });
    next();
  } catch (err) {
    sendResponse({ res, err, statusCode: 400 });
  }
};

module.exports = { quantityValidator };
