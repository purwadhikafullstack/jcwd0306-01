const { ResponseError } = require('../../errors');
const { Carousel } = require('../../models');

async function getCarouselImageById(req) {
  const carousel = await Carousel.findByPk(req.params.id, {
    attributes: ['image'],
  });
  const image = carousel?.getDataValue('image');
  if (!image) throw new ResponseError('carousel image not found', 404);
  return carousel.getDataValue('image');
}

module.exports = getCarouselImageById;
