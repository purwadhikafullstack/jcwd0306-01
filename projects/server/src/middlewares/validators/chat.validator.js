const chatValidator = {
  inputValidator: async (req, res, next) => {
    req.params.userId = Number(req.params.userId);
    req.body.warehouseId = Number(req.body.warehouseId);
    req.body.orderId = Number(req.body.orderId);
    if (req.body.receiverId) req.body.receiverId = Number(req.body.receiverId);
    next();
  },
};

module.exports = chatValidator;
