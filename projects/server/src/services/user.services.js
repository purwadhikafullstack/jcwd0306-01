/* eslint-disable default-case */
const { Op, where } = require('sequelize');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
// const { sequelize } = require('../models');
const Service = require('./baseServices');
const mailer = require('../lib/nodemailer');

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` });
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

class User extends Service {
  getByID = async (req) => {
    const { id } = req.params;
    try {
      const users = await this.db.findAll({
        where: { id },
      });
      return users;
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  findUser = async (email) => {
    try {
      const data = await this.db.findOne({
        where: {
          [Op.or]: [{ email }],
        },
      });
      return data;
    } catch (err) {
      return err;
    }
  };

  mailerEmail = async (data, email) => {
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
    try {
      const result = await this.db.findOne({
        where: {
          email,
        },
      });
      // console.log('result', result.dataValues.password);
      if (!result) throw new Error('wrong email/password');
      const isValid = await bcrypt.compare(
        password,
        result.dataValues.password
      );
      // console.log('isValid', isValid);
      if (!isValid) {
        throw new Error('wrong password');
      }
      result.setDataValue('password', undefined);

      const payload = { ...result.toJSON() };
      // console.log('payload', payload);

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '24h',
      });

      return { token, user: result };
    } catch (err) {
      return err?.message;
    }
  };
}

module.exports = new User('User');
