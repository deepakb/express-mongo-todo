const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('./config/logger');
const environment = require('./utils/env');
const notFound = require('./middleware/not-found');
const errorHelper = require('./middleware/error-handler');

require('./models/User');

const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const isProduction = environment === 'production';

// Create express app
const app = express();

// Config defaults...
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (!isProduction) app.use(errorHandler());

// Connect to DB
const mongoCloudConnectionSetting = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  isProduction
    ? process.env.PROD_MONGO_CLUSTER
    : process.env.LOCAL_MONGO_CLUSTER,
  mongoCloudConnectionSetting,
  (err) => {
    if (err) logger.log('error', { message: err.message });
  }
);
mongoose.connection.on('connected', (err) => {
  if (err) {
    logger.log('error', { message: err.message });
  } else {
    logger.log('info', { message: 'Connect to mongo instance!' });
  }
});
mongoose.connection.on('error', (err) => {
  if (err) logger.log('error', { message: err.message });
});

// Use routes
app.use(routes);

// Use middlewares
app.use(notFound);
app.use(errorHelper);

// Access the server by listening to the defined port
app.listen(PORT, () => {
  logger.log('info', `Server started in port ${PORT}`);
});
