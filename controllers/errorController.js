const AppError = require('../utils/appError');

const handleJWTError = () => {
  const message = `Invalid token. Please login again`;
  return new AppError(message, 400);
};

const handleJWTExpiredError = () => {
  const message = `Expired token. Please login again`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 401);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((value) => value.message)
    .join('. ');
  const message = `Invalid input data. ${errors}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //API
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDER WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // Operation, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    //API
    if (err.isOperation) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programing or other unknown error: dont want to leak error details
    console.error('Error 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
  //RENDER WEBSITE
  if (err.isOperation) {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: 'Please try again later!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const NODE_ENVIROMENT = process.env.NODE_ENV.trim();

  if (NODE_ENVIROMENT === 'development') {
    sendErrorDev(err, req, res);
  } else if (NODE_ENVIROMENT === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
