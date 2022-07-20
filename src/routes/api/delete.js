const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  //console.log(req.query({ expand: 1 }));
  try {
    await Fragment.delete(req.user, req.params.id);

    res.status(200).send(createSuccessResponse({ status: 'ok' }));
  } catch (err) {
    res.status(404).send(createErrorResponse(404, 'Id not found'));
  }
};
