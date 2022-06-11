//source/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

//authorization middleware
const { authenticate } = require('../authorization');

//for success message middleware
const { createSuccessResponse } = require('../response');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * this will allow to authentication to able to access other api
 */
router.use(`/v1`, authenticate(), require('./api'));
/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 **/
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');

  const data = {
    author: author,
    githubUrl: 'https://github.com/kevinsanpedro/fragment.git/fragments',
    version: version,
  };

  res.status(200).send(createSuccessResponse(data));
});

module.exports = router;
