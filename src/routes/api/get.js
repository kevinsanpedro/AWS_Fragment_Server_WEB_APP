/**
 * Get a list of fragments for the current user
 */
const { createSuccessResponse } = require('../../response');
module.exports = (req, res) => {
  const data = { fragments: [] };
  res.status(200).send(createSuccessResponse(data));
};
