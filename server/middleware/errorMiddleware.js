// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error('Error encountered:', err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}

function notFoundHandler(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
