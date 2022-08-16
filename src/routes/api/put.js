const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byId(req.user, req.params.id);

    const updated_fragment = new Fragment({
      id: fragments.id,
      ownerId: fragments.ownerId,
      type: fragments.type,
      size: fragments.size,
    });

    if (updated_fragment.mimeType !== req.get('Content-Type')) {
      throw new Error('wrong type');
    }
    await updated_fragment.setData(req.body);
    res.status(200).send(createSuccessResponse({ updated_fragment }));
  } catch (err) {
    if (err) {
      res
        .status(400)
        .send(
          createErrorResponse(
            400,
            'content type must be the same from previous fragment data type '
          )
        );
    } else {
      res.status(404).send(createErrorResponse(404, 'fragment not found'));
    }
  }
};
