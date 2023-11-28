const { Op } = require('sequelize');
const cron = require('node-cron');
const db = require('../models');

const optionCronDeleteUnpaid = {
  attributes: [
    'status',
    'id',
    [
      db.sequelize.fn(
        'timediff',
        db.sequelize.fn('NOW'),
        db.sequelize.col('updatedAt')
      ),
      'timediff',
    ],
  ],
  where: {
    [Op.and]: [
      db.sequelize.where(
        db.sequelize.fn(
          'timediff',
          db.sequelize.fn('NOW'),
          db.sequelize.col('updatedAt')
        ),
        {
          [Op.gte]: '24:00:00',
        }
      ),
      { status: 'unpaid' },
    ],
  },
  logging: false,
};

const optionCronUpdateStatusReceived = {
  attributes: [
    'status',
    'id',
    [
      db.sequelize.fn(
        'timediff',
        db.sequelize.fn('NOW'),
        db.sequelize.col('updatedAt')
      ),
      'timediff',
    ],
  ],
  where: {
    createdAt: {
      [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
    },
    logging: false,
  },
};

const cronDeleteUnpaid = () =>
  cron.schedule(`2 * * * *`, async () => {
    const result = await db.Order.findAll(optionCronDeleteUnpaid);
    const id = [];
    result.forEach((order) => id.push(order.dataValues.id));
    await db.Order.update(
      { status: 'cancelled' },
      { where: { id: { [Op.in]: id } } }
    );
  });

const cronUpdateReceivedStatus = () => {
  cron.schedule(`0 0 * * *`, async () => {
    try {
      const result = await db.Order.findAll(optionCronUpdateStatusReceived);
      const id = [];
      result.forEach((order) => id.push(order.dataValues.id));
      await db.Order.update(
        { status: 'received' },
        { where: { id: { [Op.in]: id } } }
      );
      console.log(
        'cron update: order status more than 7 days, status updated to received!'
      );
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};

module.exports = { cronDeleteUnpaid, cronUpdateReceivedStatus };
