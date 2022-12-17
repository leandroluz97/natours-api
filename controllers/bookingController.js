const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingsModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get current booked tour
  const { tourId } = req.params;
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return new AppError('Tour not found', 404);
  }
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: tour.name,
            description: tour.summary,
          },
        },
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${tourId}&user=${
      req.user.id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    payment_method_types: ['card'],
    client_reference_id: tourId,
  });
  // 3) Create session as a response

  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  // NOT SECURE
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Booking.find(), req.query)
    .filter()
    .limitFields()
    .pagination();

  const bookings = await features.query;

  res.status(200).json({
    status: 'success',
    results: Array.isArray(bookings) ? bookings.length : 0,
    data: {
      bookings,
    },
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError('No Booking found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      booking,
    },
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true,
    }
  );

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByIdAndRemove(bookingId);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  res.status(204);
});
