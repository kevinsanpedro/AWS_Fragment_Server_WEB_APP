/**
 * Get a list of fragments for the current user
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');
const path = require('node:path');
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

module.exports = async (req, res) => {
  let fragment;
  let result;

  const convertExt = path.extname(req.params.id); //return .html, .txt
  const fragmentId = path.basename(req.params.id, convertExt); // return fragmentId
  try {
    //get the meta fragment and fragment data return buffer(raw data)
    fragment = await Fragment.byId(req.user, fragmentId);
    result = await fragment.getData();

    //if no extension,
    //replace the header content type to fragment data type
    //then respond original fragment data
    if (!convertExt) {
      res.set('Content-type', fragment.mimeType).status(200).send(result);
    } else if (convertExt) {
      //check fragment metadata content-type
      //-if content type is markdown
      if (fragment.mimeType === 'text/markdown') {
        //check if extension if supported, if not throw error 415
        // - if can convert markdown to html
        // - else if markdown to plain
        // - else if markdown to markdown
        // - else throw error
        if (convertExt === '.html') {
          fragment.type = 'text/html';
          res
            .set('Content-type', fragment.mimeType)
            .status(200)
            .send(md.render(`# ${result}`));
        } else if (convertExt === '.txt') {
          fragment.type = 'text/plain';
          res.set('Content-type', fragment.mimeType).status(200).send(result);
        } else if (convertExt === '.md') {
          res.set('Content-type', fragment.mimeType).status(200).send(result);
        } else {
          throw new Error('type cannot be converted or unsupported type');
        }
      }
      //-if fragment type is plain text
      else if (fragment.mimeType === 'text/plain') {
        //- if can convert plain to plain
        //-else throw error
        if (convertExt === '.txt') {
          res.set('Content-type', fragment.mimeType).status(200).send(result);
        } else {
          throw new Error('type cannot be converted or unsupported type');
        }
      }
      //- if fragment type is html
      else if (fragment.mimeType === 'text/html') {
        //if can convert to html to plain
        //else if html to html
        //else throw
        if (convertExt === '.txt') {
          fragment.type = 'text/plain';
          res.set('Content-type', fragment.mimeType).status(200).send(result);
        } else if (convertExt === '.html') {
          res.set('Content-type', fragment.mimeType).status(200).send(result);
        } else {
          throw new Error('type cannot be converted or unsupported type');
        }
      } else {
        throw new Error('unsupported type');
      }
    }
  } catch (Error) {
    //If the extension used represents an unknown or unsupported type,
    // or if the fragment cannot be converted to this type,
    //an HTTP 415 error is returned instead, with an appropriate message.
    //For example, a plain text fragment cannot be returned as a PNG.
    if (Error.message) {
      res.status(415).send(createErrorResponse(415, Error.message));
    } else {
      //If the id does not represent a known fragment, returns an HTTP 404 with an appropriate error message.
      res.status(404).send(createErrorResponse(404, 'Page not found'));
    }
  }
};
