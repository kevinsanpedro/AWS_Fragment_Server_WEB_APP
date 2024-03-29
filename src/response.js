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
    ...data, //... is the spread operator this will spread the data in the object
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
