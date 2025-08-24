const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  // Log the full error to the console for the developer
  console.error(err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId (e.g., ID is formatted incorrectly)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key (e.g., creating a user with an email that already exists)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error (e.g., a required field is missing)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Send the final, formatted error response to the client
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;