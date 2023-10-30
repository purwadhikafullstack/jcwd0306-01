'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UserAddresses', [
      {
        id: 1,
        userId: 5,
        receiverPhone: '081312312312',
        receiverName: 'Apung',
        addressName: 'Rumah Pak Apung',
        country: 'Indonesia',
        provinceId: 5,
        cityId: 501,
        postalCode: 55122,
        district: 'Gondomanan',
        village: 'Ngupasan',
        detail: 'Jl. Kebagusan RT001/RW001 No.1',
        longitude: -7.799325835101871,
        latitude: 110.36314680416393,
        isDefault: 1,
        createdAt: '2023-10-17 13:52:16',
        updatedAt: '2023-10-17 13:52:16',
      },
      {
        id: 2,
        userId: 5,
        receiverPhone: '0812345678',
        receiverName: 'Gina',
        addressName: 'Rumah Kakak',
        country: 'Indonesia',
        provinceId: 6,
        cityId: 153,
        postalCode: 12560,
        district: 'Pasar Minggu',
        village: 'Cilandak Timur',
        detail: 'Jl. Kebagusan RT002/RW002 No.2',
        longitude: -6.2882876605342615,
        latitude: 106.81678639918655,
        isDefault: 0,
        createdAt: '2023-10-17 13:55:04',
        updatedAt: '2023-10-17 13:55:04',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserAddresses', { id: [1, 2] });
  },
};
