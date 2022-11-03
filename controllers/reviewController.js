const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');

exports.getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Review.findById(id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204);
});

exports.getReviews = catchAsync(async (req, res, next) => {
  const { userId, tourId } = req.params;
  const option = {};

  if (userId) {
    option.user = userId;
  } else {
    option.tour = tourId;
  }
  const features = new APIFeatures(Review.find(option), req.query)
    .limitFields()
    .pagination();

  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {});

exports.updateReview = catchAsync(async (req, res, next) => {});

exports.deleteReview = catchAsync(async (req, res, next) => {});
