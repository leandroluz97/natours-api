const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const extension = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });
const multerStorage = multer.memoryStorage();

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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filteredObj = (body, ...args) =>
  args.reduce((acc, value) => {
    if (body[value]) {
      acc[value] = body[value];
    }
    return acc;
  }, {});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .limitFields()
    .pagination();
  const users = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    '-__v -passwordChangedAt'
  );
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    results: 1,
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //   console.log(req.file);
  //   console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not intended for password update. Please use 'users/new-password'!`,
        400
      )
    );
  }

  const filteredBody = filteredObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    next(new AppError(`User does not exist!`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not implemented',
  });
};

exports.patchUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not implemented',
  });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findOneAndDelete({ _id: req.user._id });
  if (!deletedUser) {
    return next(new AppError(`User with id '${req.user._id}' not found!`, 404));
  }

  res.status(204).json();
});

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not implemented',
  });
};
