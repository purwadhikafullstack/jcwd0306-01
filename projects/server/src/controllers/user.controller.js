const userServices = require('../services/user.services');

class UserController {
  static test = async (req, res) => {
    try {
      const data = await userServices.getAll();
      return res.send(data);
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };
}

module.exports = UserController;
