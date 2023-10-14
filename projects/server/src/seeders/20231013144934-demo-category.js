'use strict';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` });
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert('Categories', [
      {
        id: 1,
        name: 'Camera',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Camera.jpg`),
        createdAt: new Date(2023, 5, 1),
        updatedAt: new Date(2023, 5, 1),
      },
      {
        id: 2,
        name: 'Desktop',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Desktop.jpg`),
        createdAt: new Date(2023, 5, 1),
        updatedAt: new Date(2023, 5, 1),
      },
      {
        id: 3,
        name: 'Drone',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Drone.jpg`),
        createdAt: new Date(2023, 5, 2),
        updatedAt: new Date(2023, 5, 2),
      },
      {
        id: 4,
        name: 'Game Console',
        image: fs.readFileSync(
          `${process.env.CATEGORY_IMAGE}\\Game Console.jpg`
        ),
        createdAt: new Date(2023, 5, 2),
        updatedAt: new Date(2023, 5, 2),
      },
      {
        id: 5,
        name: 'Laptop',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Laptop.jpg`),
        createdAt: new Date(2023, 5, 3),
        updatedAt: new Date(2023, 5, 3),
      },
      {
        id: 6,
        name: 'Mini PC',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Mini PC.jpg`),
        createdAt: new Date(2023, 5, 3),
        updatedAt: new Date(2023, 5, 3),
      },
      {
        id: 7,
        name: 'Smartband',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Smartband.jpg`),
        createdAt: new Date(2023, 5, 4),
        updatedAt: new Date(2023, 5, 4),
      },
      {
        id: 8,
        name: 'Smartphone',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Smartphone.jpg`),
        createdAt: new Date(2023, 5, 4),
        updatedAt: new Date(2023, 5, 4),
      },
      {
        id: 9,
        name: 'Smartwatch',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Smartwatch.jpg`),
        createdAt: new Date(2023, 5, 5),
        updatedAt: new Date(2023, 5, 5),
      },
      {
        id: 10,
        name: 'Tablet',
        image: fs.readFileSync(`${process.env.CATEGORY_IMAGE}\\Tablet.jpg`),
        createdAt: new Date(2023, 5, 5),
        updatedAt: new Date(2023, 5, 5),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Categories', null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
