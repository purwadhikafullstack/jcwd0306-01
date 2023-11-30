/* eslint-disable default-case */
const { Op } = require('sequelize');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const axios = require('axios');
const db = require('../models');
// const { sequelize } = require('../models');
const Service = require('./baseServices');
const mailer = require('../lib/nodemailer');
const { ResponseError } = require('../errors');
const {
  attributesCountStatus,
  includeOrderCart,
} = require('./user.service/optionGetDetailsByID');
const { sendResponse } = require('../utils');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
});
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

class User extends Service {
  getByID = async (req) => {
    const { id } = req.params;
    const decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (decoded.id !== Number(id))
      throw new ResponseError('Invalid credential', 401);
    const user = await this.db.findByPk(id, {
      attributes: { exclude: ['password', 'image'] },
      include: [
        {
          model: db.WarehouseUser,
          paranoid: false,
          include: [{ model: db.Warehouse, paranoid: false }],
        },
      ],
      logging: false,
    });
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
    return { token, user };
  };

  findUser = async (email, config = []) => {
    try {
      const data = await this.db.findOne({
        where: {
          [Op.or]: [{ email }],
        },
        attributes: { exclude: ['password', ...config] },
        raw: true,
        logging: false,
      });
      return data;
    } catch (error) {
      sendResponse({ error });
      throw error;
    }
  };

  findUserEditPassword = async (email) => {
    try {
      const data = await this.db.findOne({
        where: {
          [Op.or]: [{ email }],
        },
        raw: true,
        logging: false,
      });
      return data;
    } catch (error) {
      sendResponse({ error });
      throw error;
    }
  };

  // eslint-disable-next-line class-methods-use-this
  mailerEmail = (data, email, token) => {
    try {
      let template;
      let compiledTemplate;
      let subject;
      let html;
      const registrationLink = `${process.env.URL}verify`;

      switch (data) {
        case 'register':
          subject = 'email verification link';
          template = fs.readFileSync(
            path.join(__dirname, '../template/register.html'),
            'utf-8'
          );
          compiledTemplate = handlebars.compile(template);
          html = compiledTemplate({
            registrationLink,
            email,
          });
          break;
        case 'forget-password':
          subject = 'RESET PASSWORD';
          template = fs.readFileSync(
            path.join(__dirname, '../template/forgotPassword.html'),
            'utf-8'
          );
          compiledTemplate = handlebars.compile(template);
          html = compiledTemplate({
            registrationLink: `${process.env.URL}change-password?token=${token}`,
          });
          break;
      }
      mailer({
        subject,
        to: email,
        html,
      });
    } catch (error) {
      sendResponse({ error });
    }
  };

  verifyUser = async (req, t) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!req.body.email) {
        throw new Error('Email is required!');
      }
      const existingUser = await this.db.findOne({
        where: { email },
        logging: false,
      });
      if (!existingUser) {
        throw new Error('User not found');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const updateResult = await this.db.update(
        {
          firstName,
          lastName,
          password: hashedPassword,
          isVerified: 1,
        },
        { where: { email }, transaction: t, logging: false }
      );

      if (updateResult[0] === 0) throw new Error('User not found');

      return updateResult;
    } catch (error) {
      sendResponse({ error });
      throw error;
    }
  };

  signIn = async (
    t,
    email,
    password,
    providerId,
    firstName,
    lastName,
    uid,
    photoURL
  ) => {
    let passwordNotCreated = false;
    const result = await this.db.findOne({
      logging: false,
      where: {
        email,
      },
      include: [
        {
          model: db.WarehouseUser,
          paranoid: false,
          include: [{ model: db.Warehouse, paranoid: false }],
        },
      ],
      attributes: { exclude: ['image'] },
      transaction: t,
    });
    if (!result && !providerId) {
      throw new Error('User not found');
    }
    if (!result && providerId) {
      const response = await axios.get(photoURL, {
        responseType: 'arraybuffer',
      });
      const processedImage = await sharp(response.data).png().toBuffer();
      const hashedPassword = await bcrypt.hash('@NO_P455W0RD', 10);
      const googleLogin = await this.db.create(
        {
          email,
          firstName,
          lastName,
          uuidGoogle: uid,
          isCustomer: 1,
          isAdmin: 0,
          isVerified: 1,
          password: hashedPassword,
          image: processedImage,
        },
        {
          logging: false,
          transaction: t,
        }
      );

      const payload = googleLogin.toJSON();
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
      });

      return { token, user: googleLogin };
    }
    if (providerId !== 'google.com') {
      if (result.uuidGoogle !== null) {
        const isDefaultPassword = await bcrypt.compare(
          '@NO_P455W0RD',
          result.getDataValue('password')
        );
        if (isDefaultPassword) {
          passwordNotCreated = true;
          result.setDataValue('isNotCreatePassword', passwordNotCreated);
          return result;
        }
      }
      const isValid = await bcrypt.compare(
        password,
        result.getDataValue('password')
      );
      if (!isValid) {
        throw new Error('wrong password');
      }
      result.setDataValue('password', undefined);
    }
    const payload = result.toJSON();
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
    return { token, user: result };
  };

  handleEdit = async (userId, req) => {
    const { isdefault, ...updatedData } = req.body;

    await this.db.update(updatedData, {
      where: { id: userId },
      logging: false,
    });

    const result = await this.db.findByPk(userId, { logging: false });
    return result;
  };

  handleUploadAvatar = async (req) => {
    try {
      const { id } = req.body;
      req.body.avatar = await sharp(req.file.buffer).png().toBuffer();

      const data = await this.db.update(
        {
          image: req.body.avatar,
        },
        {
          where: { id },
          logging: false,
        }
      );
      return data;
    } catch (error) {
      sendResponse({ error });
      throw error;
    }
  };

  handleEditPassword = async (body, t) => {
    try {
      const { newPassword, email } = body;
      const hashPassword = await bcrypt.hash(newPassword, 10);
      const data = await this.db.update(
        { password: hashPassword },
        { where: { email }, transaction: t, logging: false }
      );
      return data;
    } catch (error) {
      sendResponse({ error });
      throw error;
    }
  };

  getDetailsById = async (req) => {
    const result = await this.getOneByID(req, {
      attributes: attributesCountStatus(req),
      include: includeOrderCart,
      logging: false,
    });
    const order = this.encryptMultiResult({ count: 1, rows: result.UserOrder });
    return { ...result.dataValues, UserOrder: order.rows };
  };

  handleForgetPassword = async (email, hashPassword, t) => {
    try {
      const isUserExist = await this.findUser(email, ['image']);
      if (!isUserExist) throw new Error('User not Found!');

      const data = await this.db.update(
        { password: hashPassword, forget_password_token: null },
        { where: { email }, transaction: t, logging: false }
      );
      return data;
    } catch (error) {
      sendResponse({ error });
      throw error;
    }
  };

  pushToken = async (email, token) => {
    try {
      const result = await this.db.update(
        { forget_password_token: token },
        { where: { email }, logging: false }
      );
      return result;
    } catch (error) {
      sendResponse({ error });
      throw error;
    }
  };

  getUserImagebyId = async (req) => {
    const user = await this.db.findByPk(req.params.id, {
      attributes: ['image'],
      raw: true,
      logging: false,
    });
    if (!user?.image) throw new ResponseError('user image not found', 404);
    return user.image;
  };

  deleteAvatar = async (req) => {
    const { userId } = req.params;
    const user = await this.db.findByPk(userId, {
      attributes: ['id'],
      logging: false,
    });
    if (user) {
      user.image = null;
      await user.save();
      return user;
    }
    throw new ResponseError('user not found', 404);
  };
}

module.exports = new User('User');
