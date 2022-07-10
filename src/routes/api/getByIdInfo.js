const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).send(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    res.status(404).send(createErrorResponse(404, 'page not found'));
  }
};
