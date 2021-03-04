const errorHelper = (type = 'all', isProduction = false) => {
  if (type === 'api') {
    return (err, req, res, next) => {
      if (err.name === 'ValidationError') {
        return res.status(422).json({
          errors: Object.keys(err.errors).reduce((errors, key) => {
            // eslint-disable-next-line no-param-reassign
            errors[key] = err.errors[key].message;
            return errors;
          }, {}),
        });
      }

      return next(err);
    };
  }

  // eslint-disable-next-line no-unused-vars
  return (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
        error: isProduction ? {} : error,
      },
    });
  };
};

module.exports = errorHelper;
