const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const data1 = await Fragment.delete(req.user, req.params.id);

    res.status(200).send(createSuccessResponse({ status: data1 }));
  } catch (err) {
    res.status(404).send(createErrorResponse(404, err.message));
  }
};
