/**
 * Get a list of fragments for the current user
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');

module.exports = async (req, res) => {
  let fragment;
  let result;
  //console.log(req.params.id);
  let query = req.params.id.split('.');

  // if (query.length == 1) {
  try {
    if (query.length === 2) {
      fragment = await Fragment.byId(req.user, query[0]);
      result = await fragment.getData();
      res.setHeader('Content-Type', `'text/${query[1]}`);
      result = result.toString();
      res.status(200).send(result);
    } else {
      fragment = await Fragment.byId(req.user, req.params.id);
      res.setHeader('Content-Type', fragment.mimeType);
      result = await fragment.getData();
      result = result.toString();

      res.status(200).send(result);
    }
  } catch (err) {
    res.send(createErrorResponse(404, 'Page not found'));
  }
};
