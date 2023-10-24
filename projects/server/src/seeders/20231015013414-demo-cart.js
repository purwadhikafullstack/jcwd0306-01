'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Carts', [
      {
        userId: 5,
        productId: 1,
        quantity: 1,
        isChecked: 1,
        note: 'langsung kirim',
        createdAt: '2023-10-17 13:56:36',
        updatedAt: '2023-10-17 13:56:36',
      },
      {
        userId: 5,
        productId: 2,
        quantity: 1,
        isChecked: 0,
        note: 'terserah warna apa aja',
        createdAt: '2023-10-17 13:56:36',
        updatedAt: '2023-10-17 13:56:36',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', { userId: [5] });
  },
};
