/**
 * Get a list of fragments for the current user
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('node:path');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

module.exports = async (req, res) => {
  const convertExt = path.extname(req.params.id); //return .html, .txt
  const fragmentId = path.basename(req.params.id, convertExt); // return fragmentId

  try {
    //get the meta fragment and fragment data return buffer(raw data)
    let fragment = await Fragment.byId(req.user, fragmentId);
    let result = await fragment.getData();
    //if no extension,
    //replace the header content type to current fragment content type
    //then response with original fragment data
    if (!convertExt) {
      res.set('Content-type', fragment.mimeType).status(200).send(result);
    } else if (convertExt) {
      // - if all mimetype start with text, and app/json can use .txt to convert to plain/text
      // - set fragment type to text/plain
      // - response with status 200, and set header to current fragment type
      if (
        (fragment.mimeType.startsWith('text/') && convertExt === '.txt') ||
        (fragment.mimeType === 'application/json' && convertExt === '.txt')
      ) {
        fragment.type = 'text/plain';
        res.set('Content-type', fragment.mimeType).status(200).send(result);
      }
      //- else if markdown to md. send back original fragment, no change or
      //- html to html send back fragment no change or
      //- application/json to .json, send back original fragment no change or
      else if (
        (fragment.mimeType === 'text/markdown' && convertExt === '.md') ||
        (fragment.mimeType === 'text/html' && convertExt === '.html') ||
        (fragment.mimeType === 'application/json' && convertExt === '.json')
      ) {
        res.set('Content-type', fragment.mimeType).status(200).send(result);
      }
      //else if markdown to html
      else if (fragment.mimeType === 'text/markdown' && convertExt === '.html') {
        fragment.type = 'text/html';
        res
          .set('Content-type', fragment.mimeType)
          .status(200)
          .send(md.render(`# ${result}`));
      }
      //else no conversion found throw an error
      else {
        throw new Error('Unsupported type');
      }
    }
  } catch (Error) {
    //If the extension used represents an unknown or unsupported type,
    // or if the fragment cannot be converted to this type,
    //an HTTP 415 error is returned instead, with an appropriate message.
    //For example, a plain text fragment cannot be returned as a PNG.
    if (Error.message === 'Unsuported type') {
      res.status(415).send(createErrorResponse(415, Error.message));
    } else if (Error.message == 'Page not found') {
      res.status(404).send(createErrorResponse(404, 'Page not found' + Error.message));
    } else {
      //If the id does not represent a known fragment, returns an HTTP 404 with an appropriate error message.
      res.status(500).send(createErrorResponse(415, Error.message));
    }
  }
};
