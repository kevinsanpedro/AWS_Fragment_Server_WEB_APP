/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */

module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    //... is the spread operator this will clode the data in the object
    ...data,
  };
};

// eslint-disable-next-line no-unused-vars
module.exports.createErrorResponse = function (code, message) {
  return {
    status: 'error',
    error: {
      code: code,
      message: message,
    },
  };
};
