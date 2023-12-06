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
  cron.schedule(`*/10 * * * *`, async () => {
    try {
      console.log(`'cron update [delete unpaid]: start'`);
      const result = await db.Order.findAll(optionCronDeleteUnpaid);
      if (!result.length) {
        console.log('cron update: no changes');
        return;
      }
      console.log(`'cron update [delete unpaid]: target:'`, result);
      const id = [];
      result.forEach((order) => id.push(order.dataValues.id));
      await db.Order.update(
        { status: 'cancelled' },
        { where: { id: { [Op.in]: id } } }
      );
      console.log(
        `'cron update [delete unpaid]: finish, affecting ${result.length} datas'`
      );
    } catch (error) {
      console.log('Error in cron job delete unpaid:', error);
    }
  });

const cronUpdateReceivedStatus = () => {
  cron.schedule(`0 0 * * *`, async () => {
    try {
      const result = await db.Order.findAll(optionCronUpdateStatusReceived);
      if (!result.length) {
        console.log('cron update: no changes');
        return;
      }
      const id = [];
      result.forEach((order) => id.push(order.dataValues.id));
      await db.Order.update(
        { status: 'received' },
        { where: { id: { [Op.in]: id } } }
      );
      console.log(
        `'cron update [update received]: finish, affecting ${result.length} datas'`
      );
    } catch (error) {
      console.log('Error in cron job update received:', error);
    }
  });
};

module.exports = { cronDeleteUnpaid, cronUpdateReceivedStatus };
