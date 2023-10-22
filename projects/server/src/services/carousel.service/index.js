const createCarousel = require('./createCarousel');
const getCarousels = require('./getCarousels');
const getCarouselImageById = require('./getCarouselImageById');

const carouselService = {
  createCarousel,
  getCarousels,
  getCarouselImageById,
};

module.exports = carouselService;
