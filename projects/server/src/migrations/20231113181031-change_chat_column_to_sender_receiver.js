'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('Chats', 'userId', 'senderId');
    await queryInterface.addColumn('Chats', 'receiverId', {
      type: Sequelize.INTEGER,
      after: 'senderId',
      references: { model: 'Users', key: 'id' },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('Chats', 'senderId', 'userId');
    await queryInterface.removeColumn('Chats', 'receiverId');
  },
};
