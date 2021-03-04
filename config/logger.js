const { createLogger, transports, format } = require('winston');
const chalk = require('chalk');
const moment = require('moment');

const { combine, timestamp, printf } = format;
const loggerIcon = {
  info: chalk.blue('ℹ'),
  error: chalk.red('✖'),
  debug: chalk.green('✔'),
  warn: chalk.yellow('⚠'),
};

const myFormat = printf(
  // eslint-disable-next-line no-shadow
  ({ level, message, timestamp }) =>
    `${loggerIcon[level]} [${level}] [${moment(timestamp).format(
      'M-D-YYYY h:mm:ss'
    )}] ${message}`
);

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [new transports.Console()],
});

module.exports = logger;
