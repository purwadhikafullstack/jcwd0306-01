const userServices = require('../services/user.services');

class UserController {
  static getById = async (req, res) => {
    try {
      const data = await userServices.getByID(req);
      return res.send(data);
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };
}

module.exports = UserController;
