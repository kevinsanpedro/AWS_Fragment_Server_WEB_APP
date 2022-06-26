/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).send(createSuccessResponse({ fragment: fragment }));
    logger.info(fragment, `get fragment`);
  } catch (err) {
    logger.fatal({ err, origin }, 'uncaughtException');
    res.status(404).send(createErrorResponse(404, 'page not found'));
  }
};
