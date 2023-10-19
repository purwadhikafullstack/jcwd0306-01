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

module.exports = router;
