const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, reviewController.createReview);

router.get('/:reviewId', reviewController.getReview);

router.get('/user/:userId', reviewController.getReviews);

router.get('/tour/:tourId', reviewController.getReviews);

router.delete(
  '/:reviewId',
  authController.protect,
  reviewController.deleteReview
);

router.patch(
  '/:reviewId',
  authController.protect,
  reviewController.updateReview
);

module.exports = router;
