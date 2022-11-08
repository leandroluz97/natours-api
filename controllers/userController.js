const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not intended for password update. Please use 'users/new-password'!`,
        400
      )
    );
  }

  const filteredBody = filteredObj(req.body, 'name', 'email');

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
  const user = await User.findByIdAndUpdate(
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
