const multer = require('multer');
const sharp = require('sharp');

const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
//   const id = parseInt(req.params.id, 10);
//   const tour = tours.find((tour) => tour.id === id);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid tour ID'
//     });
//   }
//   next();
// };
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );

  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price';
  req.query.orderby = 'asc';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.checkNewTourData = (req, res, next) => {
  // const { body } = req;
  // const validateProperties = !body.name || !body.duration || !body.difficulty;
  // const validatePropertiesTypes =
  //   typeof body.name !== 'string' ||
  //   Number.isNaN(parseInt(body.duration, 10)) ||
  //   typeof body.difficulty !== 'string';

  // if (validateProperties || validatePropertiesTypes) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid tour Body request',
  //   });
  // }
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .limitFields()
    .pagination();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate('reviews').select('-tour');
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      tour,
    },
  });
});

exports.patchTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true,
    }
  );

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const tour = await Tour.findByIdAndRemove(id);
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(204);
// });

exports.createTour = catchAsync(async (req, res, next) => {
  const { body } = req;
  const newTour = await Tour.create(body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [latitude, longitude] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!latitude || !longitude) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(201).json({
    status: 'success',
    results: (tours && tours.length) || 0,
    data: {
      tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [latitude, longitude] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!latitude || !longitude) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(201).json({
    status: 'success',
    data: {
      distances,
    },
  });
});

exports.getTourStatistics = catchAsync(async (req, res, next) => {
  const statistics = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        total: { $sum: 1 },
        totalRatings: { $sum: '$ratingsQuantity' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        averagePrice: 1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);

  res.status(201).json({
    status: 'success',
    data: {
      statistics,
    },
  });
});

exports.getTourMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = parseInt(req.params.year, 10);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(201).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
