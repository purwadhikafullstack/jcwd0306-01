const router = require('express').Router();
const { carouselController } = require('../controllers');
const {
  multerBlobUploader,
  multerErrorHandler,
} = require('../middlewares/multers');
const { carouselValidator } = require('../middlewares/validators');

// create carousel
router.post(
  '/',
  multerBlobUploader().single('image'),
  multerErrorHandler,
  carouselValidator.createCarousel,
  carouselController.createCarousel
);

// get carousels
router.get('/', carouselController.getCarousels);

// get carousel image by carouselId
router.get(
  '/images/:id',
  carouselValidator.getCarouselImageById,
  carouselController.getCarouselImageById
);

module.exports = router;
