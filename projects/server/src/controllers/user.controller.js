const bcrypt = require('bcrypt');
const userServices = require('../services/user.services');
const db = require('../models');

class UserController {
  static getById = async (req, res) => {
    try {
      const data = await userServices.getByID(req);
      return res.send(data);
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };

  static register = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { email, firstName, lastName, password } = req.body;
      const isUserExist = await userServices.findUser(email);
      // console.log(isUserExist);

      if (isUserExist) {
        await t.rollback();
        return res.status(400).send({ message: 'email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.User.create(
        { email, firstName, lastName, password: hashedPassword },
        { transaction: t }
      );

      userServices.mailerEmail('register', email);

      t.commit();
      return res.status(201).send({
        message: 'success register',
        data: newUser,
      });
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };

  static verify = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await userServices.verifyUser(req.body, t);
      // const isUserExist = await userServices.findUser(req.body.email);
      // if (isUserExist) {
      //   await t.rollback();
      //   return res.status(400).send({ message: 'user already verified' });
      // }

      t.commit();
      return res.status(200).send({ message: 'success create account' });
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const signInResult = await userServices.signIn(email, password);
      return res.status(200).send({ signInResult });
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  };
}

module.exports = UserController;
