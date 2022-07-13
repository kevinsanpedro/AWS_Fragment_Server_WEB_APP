const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');
const path = require('node:path');
module.exports = async (req, res) => {
  try {
    const convertExt = path.extname(req.params.id); //return .html, .txt
    const fragmentId = path.basename(req.params.id, convertExt); // return fragmentId

    if (fragmentId) {
      const fragment = await Fragment.byId(req.user, req.params.id);
      res.status(200).send(createSuccessResponse({ fragment: fragment }));
    }
  } catch (err) {
    res.status(404).send(createErrorResponse(404, 'page not found'));
  }
};
