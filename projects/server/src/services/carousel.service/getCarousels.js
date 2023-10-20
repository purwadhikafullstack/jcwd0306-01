const { Carousel } = require('../../models');

async function getCarousels() {
  const carousels = await Carousel.findAll({
    attributes: { exclude: ['image'] },
    raw: true,
  });
  return carousels;
}

module.exports = getCarousels;
