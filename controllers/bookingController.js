const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
    success_url: `${req.protocol}://${req.get('host')}/`,
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
