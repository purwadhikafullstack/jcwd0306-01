const db = require('../../models');

const includeSenderReceiver = [
  {
    model: db.User,
    as: 'Receiver',
    attributes: ['id', 'firstName', 'lastName'],
  },
  {
    model: db.User,
    as: 'Sender',
    attributes: ['id', 'firstName', 'lastName'],
  },
];

module.exports = includeSenderReceiver;
