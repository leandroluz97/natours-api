const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, reviewController.createReview);

router.get(
  '/user/:userId',
  authController.protect,
  reviewController.getReviews
);

router.get(
  '/tour/:tourId',
  authController.protect,
  reviewController.getReviews
);

router.delete(
  '/user/:userId/:reviewId',
  authController.protect,
  reviewController.deleteReview
);

module.exports = router;
