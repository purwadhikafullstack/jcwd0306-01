/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

'use strict';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` });
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

async function getCategoryImages() {
  const urlImages = JSON.parse(process.env.URL_CATEGORY_IMAGES);
  const images = {};
  for (const name in urlImages) {
    const { data } = await axios.get(urlImages[name], {
      responseType: 'arraybuffer',
    });
    const buffer = await sharp(data).resize({ width: 240 }).toBuffer();
    images[name] = buffer;
  }
  return images;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const images = await getCategoryImages();

    await queryInterface.bulkInsert('Categories', [
      {
        id: 1,
        name: 'Camera',
        image: images.Camera,
        createdAt: new Date(2023, 5, 1),
        updatedAt: new Date(2023, 5, 1),
      },
      {
        id: 2,
        name: 'Desktop',
        image: images.Desktop,
        createdAt: new Date(2023, 5, 1),
        updatedAt: new Date(2023, 5, 1),
      },
      {
        id: 3,
        name: 'Drone',
        image: images.Drone,
        createdAt: new Date(2023, 5, 2),
        updatedAt: new Date(2023, 5, 2),
      },
      {
        id: 4,
        name: 'Game Console',
        image: images['Game Console'],
        createdAt: new Date(2023, 5, 2),
        updatedAt: new Date(2023, 5, 2),
      },
      {
        id: 5,
        name: 'Laptop',
        image: images.Laptop,
        createdAt: new Date(2023, 5, 3),
        updatedAt: new Date(2023, 5, 3),
      },
      {
        id: 6,
        name: 'Mini PC',
        image: images['Mini PC'],
        createdAt: new Date(2023, 5, 3),
        updatedAt: new Date(2023, 5, 3),
      },
      {
        id: 7,
        name: 'Smartband',
        image: images.Smartband,
        createdAt: new Date(2023, 5, 4),
        updatedAt: new Date(2023, 5, 4),
      },
      {
        id: 8,
        name: 'Smartphone',
        image: images.Smartphone,
        createdAt: new Date(2023, 5, 4),
        updatedAt: new Date(2023, 5, 4),
      },
      {
        id: 9,
        name: 'Smartwatch',
        image: images.Smartwatch,
        createdAt: new Date(2023, 5, 5),
        updatedAt: new Date(2023, 5, 5),
      },
      {
        id: 10,
        name: 'Tablet',
        image: images.Tablet,
        createdAt: new Date(2023, 5, 5),
        updatedAt: new Date(2023, 5, 5),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
  },
};
