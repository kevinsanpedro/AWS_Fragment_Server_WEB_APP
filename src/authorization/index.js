/* eslint-disable no-undef */
//this will will be used to figure out which of the two strategies to use at runtime, based on our environment variables.

// src/authorization/index.js
// Prefer Amazon Cognito

if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  module.exports = require('./cognito');

  // module.exports = require('./basic-auth'); //use this if you want to run in curl using user:password1 do not forget to add htpasswd in env
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
  module.exports = require('./basic-auth');
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error('missing env vars: no authorization configuration found');
}
