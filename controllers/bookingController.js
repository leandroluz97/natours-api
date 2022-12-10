const stripe = require('stripe');

const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');

const stripeApi = stripe(process.env.STRIPE_PRIVATE_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get current booked tour
  const { tourId } = req.params;
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return new AppError('Tour not found', 404);
  }
  // 2) Create checkout session
  const session = stripeApi.checkout.session.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
  // 3) Create session as a response

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
