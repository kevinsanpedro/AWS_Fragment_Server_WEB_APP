/* eslint-disable no-undef */
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');

module.exports = async (req, res, next) => {
  //professors note:
  // Do a check at the top for Buffer.isBuffer() and deal with the 415 vs. here, since you could have other problems that lead to landing in this catch, and might require a 5xx response instead
  try {
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-type'),
      size: req.body.length,
    });

    await fragment.save();
    await fragment.setData(req.body);
    //location header is to locate where we put the fragments in the system
    //change process.env.api_url for aws server

    res.set('location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
    res.status(201).send(createSuccessResponse({ fragment }));
  } catch (err) {
    //check return 415 if  content type if supported send error;
    res.status(415).send(createErrorResponse(415, 'invalid content type'));
    next(err);
  }
};
