//pino logger instance

// eslint-disable-next-line no-undef
const options = { level: process.env.LOG_LEVEL || 'info' };
if (options.level === 'debug') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = require('pino')(options);
