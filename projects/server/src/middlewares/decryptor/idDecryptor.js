const Service = require(`../../services/baseServices`);

const idDecryptor = (req, res, next) => {
  req.params.id = Service.decryptID(req.params.id);
  return next();
};

module.exports = idDecryptor;
