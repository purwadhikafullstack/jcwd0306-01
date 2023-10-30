const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
});
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    timezone: process.env.MYSQL_TIMEZONE,
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    timezone: process.env.MYSQL_TIMEZONE,
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    timezone: process.env.MYSQL_TIMEZONE,
  },
};
