/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const userServices = require('../services/user.services');
const db = require('../models');
const sendResponse = require('../utils/sendResponse');
const getAllUsers = require('../services/user.service/getAllUsers');

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
    try {
      const t = await db.sequelize.transaction();
      const { email, firstName, lastName, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const isUserExist = await db.User.findOne({
        where: { email },
        attributes: { exclude: ['image', 'password'] },
        transaction: t,
      });

      if (isUserExist && isUserExist.dataValues.isVerified === true) {
        await t.rollback();
        return res.status(400).send({ message: 'email already exists' });
      }
      if (isUserExist && isUserExist.dataValues.isVerified === false) {
        await db.User.update(
          {
            email,
            firstName,
            lastName,
            password: hashedPassword,
          },
          {
            where: { email },
            transaction: t,
          }
        );
        userServices.mailerEmail('register', email);
      }

      const newUser = await db.User.create(
        { email, firstName, lastName, password: hashedPassword },
        { transaction: t }
      );

      t.commit();
      userServices.mailerEmail('register', email);
      sendResponse({ res, statusCode: 200, data: newUser });
    } catch (err) {
      sendResponse({ res, err });
    }
  };

  static verify = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await userServices.verifyUser(req, t);
      t.commit();
      return res.status(201).send({ message: 'success create account' });
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err?.message);
    }
  };

  static login = async (req, res) => {
    const { email, password, firstName, lastName, uid, photoURL } = req.body;
    const { providerId } = req.query;
    const t = await db.sequelize.transaction();
    try {
      const signInResult = await userServices.signIn(
        t,
        email,
        password,
        providerId,
        firstName,
        lastName,
        uid,
        photoURL
      );
      t.commit();
      sendResponse({ res, statusCode: 200, data: signInResult });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static edit = async (req, res) => {
    const { userId } = req.params;
    try {
      if (req.file)
        req.body.image = await sharp(req.file.buffer).png().toBuffer();

      const editedResult = await userServices.handleEdit(userId, req);
      sendResponse({ res, statusCode: 201, data: editedResult });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static uploadAvatar = async (req, res) => {
    try {
      const result = await userServices.handleUploadAvatar(req);
      sendResponse({ res, statusCode: 201, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static renderBlob = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await db.User.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return sendResponse({
          res,
          statusCode: 404,
          message: 'User not found',
        });
      }

      const imageData = user.dataValues.image;

      if (!imageData) {
        return sendResponse({
          res,
          statusCode: 404,
          message: 'Image not found for the user',
        });
      }

      // Assuming the image data is stored as a Buffer
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imageData.length,
      });

      res.end(imageData);
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static editPassword = async (req, res) => {
    const t = await db.sequelize.transaction();
    const { email } = req.body;
    try {
      const check = await userServices.findUserEditPassword(email);
      const match = await bcrypt.compare(req.body.oldPassword, check.password);
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
    }
  };

  static forgetPassword = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { email, newPassword } = req.body;
      if (!email) throw new Error('email not found!');
      if (!newPassword) throw new Error('newPassword not found!');
      const hashPassword = await bcrypt.hash(newPassword, 10);

      const response = await userServices.handleForgetPassword(
        email,
        hashPassword,
        t
      );
      await t.commit();
      sendResponse({ res, statusCode: 200, data: response });
    } catch (error) {
      await t.rollback();
      sendResponse({ res, error });
    }
  };

  static requestForgetPassword = async (req, res) => {
    try {
      const { email } = req.query;
      const user = await userServices.findUser(email, ['image']);
      if (!user) throw new Error('Email Not Found!');
      const payload = {
        id: user.id,
        email: user.email,
      };
      const generateToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '10m',
      });
      await userServices.pushToken(email, generateToken);
      userServices.mailerEmail('forget-password', email, generateToken);
      sendResponse({ res, statusCode: 200, data: generateToken });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static getForgetPasswordToken = async (req, res) => {
    try {
      const { email } = req.query;
      const result = await userServices.findUser(email, ['image']);
      sendResponse({
        res,
        statusCode: 200,
        data: result.forget_password_token,
      });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static getDetailsById = async (req, res) => {
    try {
      const result = await userServices.getDetailsById(req);
      return res.send(result);
    } catch (error) {
      return sendResponse({ res, error });
    }
  };

  static getUserImageById = async (req, res) => {
    try {
      const image = await userServices.getUserImagebyId(req);
      res.set('Content-type', 'image/png').send(image);
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static getAllUsers = async (req, res) => {
    try {
      const [users, paginationInfo] = await getAllUsers(req);
      sendResponse({ res, statusCode: 200, data: users, ...paginationInfo });
    } catch (error) {
      sendResponse({ res, error });
    }
  };

  static deleteAvatar = async (req, res) => {
    try {
      const result = await userServices.deleteAvatar(req);
      sendResponse({ res, statusCode: 200, data: result });
    } catch (error) {
      sendResponse({ res, error });
    }
  };
}

module.exports = UserController;
