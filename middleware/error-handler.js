const environment = require('../utils/env');

const isProduction = environment === 'production';

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      error: isProduction ? {} : error,
    },
  });
};

module.exports = errorHandler;
