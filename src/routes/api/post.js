/* eslint-disable no-undef */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const apiUrl = process.env.API_URL || 'http://localhost:8080';
module.exports = async (req, res) => {
  try {
    //check if the obj is empty
    if (!Fragment.isSupportedType(req.get('Content-type'))) {
      throw new Error('Not supported');
    }
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-type'),
      size: req.body.length,
    });
    //save the fragment
    await fragment.save();

    //save a raw binary data
    await fragment.setData(req.body);

    //set the location where it will
    //then send a response with fragment meta data
    res
      .set('location', `${apiUrl}/v1/fragments/${fragment.id}`)
      .status(201)
      .send(createSuccessResponse({ fragment }));
  } catch (Error) {
    if (Error.message) res.status(415).send(createErrorResponse(415, Error.message));
    else res.status(500).send(createErrorResponse(500, Error));
  }
};
