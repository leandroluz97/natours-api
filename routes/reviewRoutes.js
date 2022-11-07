const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/{tourId}/reviews
// POST /reviews
router
  .route('/')
  .get(reviewController.getReviews)
  .post(
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
