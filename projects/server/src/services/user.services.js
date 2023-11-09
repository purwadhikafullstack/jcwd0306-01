/* eslint-disable default-case */
const { Op, where } = require('sequelize');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const db = require('../models');
// const { sequelize } = require('../models');
const Service = require('./baseServices');
const mailer = require('../lib/nodemailer');
const { ResponseError } = require('../errors');
const {
  attributesCountStatus,
  includeOrderCart,
} = require('./user.service/optionGetDetailsByID');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
});
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

class User extends Service {
  getByID = async (req) => {
    const { id } = req.params;
    const decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

    const user = await this.db.findByPk(id, {
      attributes: { exclude: ['password', 'image'] },
      raw: true,
      logging: false,
    });

    if (decoded.id !== user.id)
      throw new ResponseError('invalid credential', 400);

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return { token, user };
  };

  findUser = async (email) => {
    try {
      const data = await this.db.findOne({
        where: {
          [Op.or]: [{ email }],
        },
        attributes: { exclude: ['password'] },
        raw: true,
        logging: false,
      });
      return data;
    } catch (err) {
      return err;
    }
  };

  findUserEditPassword = async (email) => {
    try {
      const data = await this.db.findOne({
        where: {
          [Op.or]: [{ email }],
        },
        raw: true,
      });
      return data;
    } catch (err) {
      return err;
    }
  };

  mailerEmail = async (data, email, token) => {
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
    } catch (err) {
      return err;
    }
  };

  verifyUser = async (body, t) => {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const whereClause = {};
      if (body.email) whereClause.email = body.email;
      return await this.db.update(
        {
          firstName: body?.firstName,
          lastName: body?.lastName,
          password: hashedPassword,
          isVerified: 1,
        },
        { where: whereClause, transaction: t }
      );
    } catch (err) {
      return err;
    }
  };

  signIn = async (email, password) => {
    const result = await this.db.findOne({
      where: {
        email,
      },
      attributes: { exclude: ['image'] },
    });

    console.log('result', result);
    if (!result) throw new Error('wrong email/password');
    const isValid = await bcrypt.compare(password, result.dataValues.password);
    // console.log('isValid', isValid);
    if (!isValid) {
      throw new Error('wrong password');
    }
    result.setDataValue('password', undefined);

    const payload = { ...result.toJSON() };
    // console.log('payload', payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return { token, user: result };
  };

  handleEdit = async (userId, req) => {
    const { isdefault, ...updatedData } = req.body;

    await this.db.update(updatedData, {
      where: { id: userId },
    });

    const result = await this.db.findByPk(userId, {
      attributes: { exclude: ['image'] },
    });
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
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  handleEditPassword = async (body, t) => {
    try {
      const { newPassword, email } = body;
      const hashPassword = await bcrypt.hash(newPassword, 10);
      const data = await this.db.update(
        { password: hashPassword },
        { where: { email }, transaction: t }
      );
      console.log(data);
      return data;
    } catch (err) {
      return err;
    }
  };

  getDetailsById = async (req) => {
    const result = await this.getOneByID(req, {
      logging: false,
      attributes: attributesCountStatus,
      include: includeOrderCart,
    });
    const order = this.encryptMultiResult({ count: 1, rows: result.UserOrder });
    return { ...result.dataValues, UserOrder: order.rows };
  };

  handleForgetPassword = async (email, hashPassword, t) => {
    try {
      const isUserExist = await this.findUser(email);
      if (!isUserExist) throw new Error('User not Found!');

      const data = await this.db.update(
        { password: hashPassword, forget_password_token: null },
        { where: { email }, transaction: t }
      );
      return data;
    } catch (error) {
      return error;
    }
  };

  pushToken = async (email, token) => {
    try {
      const result = await this.db.update(
        { forget_password_token: token },
        { where: { email } }
      );
      return result;
    } catch (error) {
      return error;
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
}

module.exports = new User('User');
