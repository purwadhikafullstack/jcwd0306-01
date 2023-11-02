const jwt = require('jsonwebtoken');
const { sendResponse } = require('../../utils');
const { findUser } = require('../../services/user.services');

const roleDecoder = {
  checkUser: async (req, res, next) => {
    try {
      const { email } = req.findUser();

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};
