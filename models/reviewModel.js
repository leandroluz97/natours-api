const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  console.log(reviewSchema.statics, tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  const [stat] = stats;
  if (!stat) return;

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stat.nRating,
    ratingsAverage: stat.avgRating,
  });
};

reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//findByIdAndUpdate
//findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // await this.findOne();
  // this.r = await this.findOne();
  // this.tour = this._conditions._id;
  // this.r = this._conditions._id;
  // this.r = this.schema.statics.calcAverageRatings;
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // this.r.constructor.calcAverageRatings(this.r.tour);
  // await reviewSchema.statics.calcAverageRatings(this.tour).bind(this);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
