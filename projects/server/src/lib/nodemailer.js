const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
});
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  auth: {
    user: process.env.nodemailer_email,
    pass: process.env.nodemailer_password,
  },
  host: 'smtp.gmail.com',
  service: 'gmail',
});

const mailer = async ({ subject, html, to, text }) => {
  await transport.sendMail({
    subject: subject || 'verifikasi email',
    html: html || '<h1> send through Gadget Gallery Mailer </h1>',
    to: to || 'nazhifsetya@gmail.com',
    text: text || 'hello user!',
  });
};

module.exports = mailer;
