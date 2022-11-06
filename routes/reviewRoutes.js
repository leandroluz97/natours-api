const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.restricTo('user'),
  reviewController.createReview
);

router.get('/user/:userId', reviewController.getReviews);

router.get('/tour/:tourId', reviewController.getReviews);

router.delete(
  '/:reviewId',
  authController.protect,
  reviewController.deleteReview
);

router.get('/:reviewId', reviewController.getReview);

router.patch(
  '/:reviewId',
  authController.protect,
  reviewController.updateReview
);

module.exports = router;
