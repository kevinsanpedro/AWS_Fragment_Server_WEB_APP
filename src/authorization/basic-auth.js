/* eslint-disable no-undef */
// src/authorization/basic-auth.js

// We'll use our authorize middle module
const authorize = require('./authorize-middleware');

// Configure HTTP Basic Auth strategy for Passport, see:
// https://github.com/http-auth/http-auth-passport
const auth = require('http-auth');
const authPassport = require('http-auth-passport');

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for a
  // username/password pair in the Authorization header.
  authPassport(
    auth.basic({
      file: process.env.HTPASSWD_FILE,
    })
  );

//previous can delete later
//module.exports.authenticate = () => passport.authenticate('http', { session: false });

//update
module.exports.authenticate = () => authorize('http');
