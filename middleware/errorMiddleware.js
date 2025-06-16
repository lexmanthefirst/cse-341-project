const errorMiddleware = (err, req, res, next) => {
  // Log the error with more details
  console.error(
    `[${new Date().toISOString()}] Error in ${req.method} ${req.originalUrl}:`,
    {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code,
    },
  );

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = [];
  let details = null;

  // Handle specific errors with more detail
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => e.message);
    details = {
      fields: Object.keys(err.errors),
      validationErrors: err.errors,
    };
  } else if (err.name === 'MongoError') {
    statusCode = 400;
    if (err.code === 11000) {
      message = 'Duplicate entry';
      details = {
        duplicateField: Object.keys(err.keyPattern)[0],
      };
    } else {
      message = 'Database error';
    }
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'AuthenticationError') {
    statusCode = 401;
    message = 'Authentication failed';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message || 'Resource not found';
  } else if (err.name === 'BadRequestError') {
    statusCode = 400;
    message = err.message;
    errors = err.errors || [];
  }

  // Format the response
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    errors: errors.length > 0 ? errors : null,
    details: process.env.NODE_ENV === 'development' ? details : null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  };

  // For production, only send minimal error info
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    response.message = 'An unexpected error occurred';
    response.errors = null;
    response.details = null;
    response.stack = null;
  }

  res.status(statusCode);
  res.json(response);
};

module.exports = errorMiddleware;
