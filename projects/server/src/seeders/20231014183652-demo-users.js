'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'admin',
        lastName: '1',
        email: 'admin1@gmail.com',
        password: await bcrypt.hash('admin1', 10),
        uuidGoogle: 'google_uuid',
        image: null,
        isCustomer: false,
        isAdmin: true,
        isWarehouseAdmin: false,
        isVerified: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now'),
      },
      {
        firstName: 'admin',
        lastName: '2',
        email: 'admin2@gmail.com',
        password: await bcrypt.hash('admin2', 10),
        uuidGoogle: 'google_uuid',
        image: null,
        isCustomer: false,
        isAdmin: true,
        isWarehouseAdmin: false,
        isVerified: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now'),
      },
      {
        firstName: 'warehouseAdmin',
        lastName: '1',
        email: 'warehouseAdmin1@gmail.com',
        password: await bcrypt.hash('warehouseAdmin1', 10),
        uuidGoogle: 'google_uuid',
        image: null,
        isCustomer: false,
        isAdmin: false,
        isWarehouseAdmin: true,
        isVerified: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now'),
      },
      {
        firstName: 'warehouseAdmin',
        lastName: '2',
        email: 'warehouseAdmin2@gmail.com',
        password: await bcrypt.hash('warehouseAdmin2', 10),
        uuidGoogle: 'google_uuid',
        image: null,
        isCustomer: false,
        isAdmin: false,
        isWarehouseAdmin: true,
        isVerified: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now'),
      },
      {
        firstName: 'user',
        lastName: '1',
        email: 'user1@gmail.com',
        password: await bcrypt.hash('user1', 10),
        uuidGoogle: 'google_uuid',
        image: null,
        isCustomer: true,
        isAdmin: false,
        isWarehouseAdmin: false,
        isVerified: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now'),
      },
      {
        firstName: 'user',
        lastName: '2',
        email: 'user2@gmail.com',
        password: await bcrypt.hash('user2', 10),
        uuidGoogle: 'google_uuid',
        image: null,
        isCustomer: true,
        isAdmin: false,
        isWarehouseAdmin: false,
        isVerified: false,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now'),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
