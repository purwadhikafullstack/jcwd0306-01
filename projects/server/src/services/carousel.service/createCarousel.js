const { Carousel } = require('../../models');

async function createCarousel(req) {
  const carousel = await Carousel.create(req.body, {
    fields: ['image'],
    logging: false,
  });
  carousel.setDataValue('image', undefined);
  return carousel;
}

module.exports = createCarousel;
