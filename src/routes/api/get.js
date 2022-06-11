/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  //console.log(req.query({ expand: 1 }));
  let isTrue = false;

  if (req.query.expand == 1) isTrue = true;

  const fragments = await Fragment.byUser(req.user, isTrue);
  res.status(200).send(createSuccessResponse({ fragments }));

  logger.info({ fragments }, `get fragment`);
};
