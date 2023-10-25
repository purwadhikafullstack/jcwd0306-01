const bcrypt = require('bcrypt');
const userServices = require('../services/user.services');
const db = require('../models');
const sendResponse = require('../utils/sendResponse');

class UserController {
  static getById = async (req, res) => {
    try {
      const user = await userServices.getByID(req);
      sendResponse({ res, statusCode: 200, data: user });
    } catch (error) {
      sendResponse({ res, error });
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
      sendResponse({ res, statusCode: 200, data: signInResult });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static edit = async (req, res) => {
    const { userId } = req.params;
    try {
      const editedResult = await userServices.handleEdit(userId, req);
      sendResponse({ res, statusCode: 201, data: editedResult });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static editPassword = async (req, res) => {
    const t = await db.sequelize.transaction();
    const { email } = req.body;
    try {
      const check = await userServices.findUser(email);
      const match = await bcrypt.compare(
        req.body.oldPassword,
        check.dataValues.password
      );
      if (!match) {
        await t.rollback();
        return sendResponse({
          res,
          statusCode: 400,
          data: 'incorrect old password',
        });
      }
      if (req.body.oldPassword === req.body.newPassword) {
        await t.rollback();
        return sendResponse({
          res,
          statusCode: 400,
          data: 'password must be different',
        });
      }
      await userServices.handleEditPassword(req.body, t);
      await t.commit();
      return sendResponse({ res, statusCode: 201, data: 'password edited' });
    } catch (error) {
      sendResponse({ res, error });
      // console.log(error);
    }
  };
}

module.exports = UserController;
