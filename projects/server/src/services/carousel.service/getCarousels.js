const { Carousel } = require('../../models');

async function getCarousels() {
  const carousels = await Carousel.findAll({
    attributes: { exclude: ['image'] },
    raw: true,
    logging: false,
  });
  return carousels;
}

module.exports = getCarousels;
