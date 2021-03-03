const express = require('express');
const bodyParser = require('body-parser');
const commandLineArgs = require('command-line-args');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
require('dotenv').config();
require('./models/User');

const routes = require('./routes');

const PORT = process.env.PORT || 3000;
const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, multiple: true, defaultOption: true },
  { name: 'timeout', alias: 't', type: Number },
];
const args = commandLineArgs(optionDefinitions);
const APP_ENV = args.src[0]
  ? args.src[0].toString().split('=')[1]
  : 'development';
const isProduction = APP_ENV === 'production';

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
  mongoCloudConnectionSetting
);

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
  console.log(`Error connecting to mongo: ${err}`);
});

// Use routes
app.use(routes);

// Catch 404 and process to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;

  next(error);
});

// Error Handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      error: isProduction ? {} : error,
    },
  });
});

// Access the server by listening to the defined port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
