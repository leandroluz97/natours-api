const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');

exports.getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
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
    .filter()
    .limitFields()
    .pagination();

  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.find({ _id: reviewId, user: req.user._id });
  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }

  const updateReview = await Review.findByIdAndUpdate(
    reviewId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true,
    }
  );

  if (!review) {
    return next(new AppError('No Review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review: updateReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { userId, reviewId } = req.params;

  if (!req.user._id || !reviewId) {
    return next(new AppError('Missing user id or review Id', 404));
  }
  const review = await Review.find({ _id: reviewId, user: req.user._id });

  if (!review || review.length === 0) {
    return next(
      new AppError('Does not exists a review with such user id.', 404)
    );
  }

  await Review.findByIdAndRemove(reviewId);
  res.status(204).json({});
});
