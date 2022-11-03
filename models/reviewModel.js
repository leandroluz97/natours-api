const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      maxLength: 250,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be above 1.0'],
      max: [5, 'A rating must be igual or below 5'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an User.'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a Tour.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.post('save', function (doc, next) {
//   this.populate({
//     path: 'user',
//     select: '-__v -passwordChangedAt',
//   });
//   next();
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
