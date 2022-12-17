const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restricTo('admin', 'lead-guide'));
router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.get('/:bookingId', bookingController.getBooking);
router.patch('/:bookingId', bookingController.updateBooking);
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;
