/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byUser(req.user, true);
    res.status(200).send(createSuccessResponse({ fragments }));

    logger.info({ fragments }, `get fragment`);
  } catch (err) {
    logger.fatal({ err, origin }, 'uncaughtException');
    res.status(404).send(createErrorResponse(404, 'page not found'));
  }
};
