const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byId(req.user, req.params.id);

    const tempFrag = new Fragment({
      id: fragments.id,
      ownerId: fragments.ownerId,
      type: fragments.type,
      size: fragments.size,
    });

    if (tempFrag.mimeType !== req.get('Content-Type')) {
      throw new Error('wrong type');
    }
    await tempFrag.setData(req.body);
    res.status(200).send(createSuccessResponse({ tempFrag }));
  } catch (err) {
    if (err) {
      res
        .status(400)
        .send(
          createErrorResponse(
            400,
            'content type must be the same from previous fragment data type ' + err.message
          )
        );
    } else {
      res.status(404).send(createErrorResponse(404, 'fragment not found'));
    }
  }
};
