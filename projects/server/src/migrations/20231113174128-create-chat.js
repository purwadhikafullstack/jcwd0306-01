'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Orders', key: 'id' },
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Warehouses', key: 'id' },
      },
      message: { type: Sequelize.STRING },
      imageURL: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  },
};
