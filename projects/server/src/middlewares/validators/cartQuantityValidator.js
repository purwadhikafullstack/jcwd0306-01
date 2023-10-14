const quantityValidator = (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { values } = req.body;
    values.forEach((product) => {
      if (product.quantity < 1)
        throw new Error(`quantity cannot be less than 0`);
      product.userId = userId;
    });
    next();
  } catch (err) {
    return res.status(400).send(err?.message);
  }
};

module.exports = { quantityValidator };
