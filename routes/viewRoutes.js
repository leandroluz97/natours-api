const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get(
  '/',
  bookingController.createBooking,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/login', authController.isLoggedIn, viewsController.getFormLogin);
router.get('/tours/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/me', authController.protect, viewsController.getAccount);
router.patch('/me', authController.protect, viewsController.updateUserData);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
