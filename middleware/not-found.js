// Catch 404 and process to error handler
const notFound = (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;

  next(error);
};

module.exports = notFound;
