/**
 * Get a list of fragments for the current user
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');
const path = require('node:path');
const e = require('express');
const { response } = require('../../app');

//disable markdown - used to convert text to html
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

module.exports = async (req, res) => {
  let fragment;
  let result;

  const convertExt = path.extname(req.params.id); //return .html, .txt
  const fragmentId = path.basename(req.params.id, convertExt); // return fragmentId
  try {
    //get the fragment
    // - this will return a raw binary data(buffer) an original data type
    // - return info meta fragment
    fragment = await Fragment.byId(req.user, fragmentId);
    // - get the data will return a buffer(raw data)
    result = await fragment.getData();

    //if no extension, return plain/text or raw data
    if (!convertExt) {
      //if fragment content type is text/plain,
      // -convert raw buffer to plain text
      // -if not respond with raw data (buffer)
      if (fragment.isText) result = result.toString();

      //replace the header content type
      //mime type return content-type without encoding
      res.set('Content-type', fragment.mimeType);
      res.status(200).send(result);
    } else if (convertExt) {
      //check fragment metadata content-type
      //-if content type is markdown
      if (fragment.mimeType === 'text/markdown') {
        //check if extension includes in formats if not throw error 415
        //e.g. markdown to html
        if (convertExt === '.html') {
          if (fragment.formats.includes('text/html')) {
            // - convert markdown to html
            res.set('Content-type', 'text/html');
            res.status(200).send(md.render(`# ${result}`));
          } else {
            throw new Error('Type is unknown or unsupported');
          }
        } else {
          throw new Error('Type is unknown or unsupported');
        }
      }
    }
  } catch (Error) {
    //If the extension used represents an unknown or unsupported type,
    // or if the fragment cannot be converted to this type,
    //an HTTP 415 error is returned instead, with an appropriate message.
    //For example, a plain text fragment cannot be returned as a PNG.
    if (Error.message === 'Type is unknown or unsupported') {
      res.status(415).send(createErrorResponse(415, Error.message));
    } else {
      //If the id does not represent a known fragment, returns an HTTP 404 with an appropriate error message.
      res.status(404).send(createErrorResponse(404, 'Page not found'));
    }
  }
};
