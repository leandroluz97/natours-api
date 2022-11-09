const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/{tourId}/reviews
// POST /reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(authController.restricTo('user'), reviewController.createReview);

router.get('/user/:userId', reviewController.getReviews);

router.get('/tour/:tourId', reviewController.getReviews);

router
  .route('/:reviewId')
  .get(reviewController.getReview)
  .patch(
    authController.restricTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restricTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
