const { Carousel } = require('../../models');

async function createCarousel(req) {
  const carousel = await Carousel.create(req.body, { fields: ['image'] });
  carousel.setDataValue('image', undefined);
  return carousel.toJSON();
}

module.exports = createCarousel;
