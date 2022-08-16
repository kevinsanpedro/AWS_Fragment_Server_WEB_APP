/**
 * Get a list of fragments for the current user
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('node:path');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

//const sharp = require('sharp');

module.exports = async (req, res) => {
  const convertExt = path.extname(req.params.id); //return .html, .txt
  const fragmentId = path.basename(req.params.id, convertExt); // return fragmentId

  try {
    //get the meta fragment and fragment data return buffer(raw data)
    let fragment = await Fragment.byId(req.user, fragmentId);

    //fragment return serialize obj, in order to fix I create a temporary constructor using the
    //serialize fragment I got from dynamodb then use this temp
    //to act as a "rehydrated" object that will allow me to access all the function.

    const tempFrag = new Fragment({
      id: fragment.id,
      ownerId: fragment.ownerId,
      type: fragment.type,
      size: fragment.size,
    });

    let result = await tempFrag.getData();

    //Rehydrating an object fragment return a serialize object and removing its function,
    //and if we try to use fragment function (e.g. getdata it will show getData() is not a function ) to fix this error we need
    //to rehydrate a fragment by creating a temp fragment using a constructor

    //if no extension,
    //replace the header content type to current fragment content type
    //then response with original fragment data
    if (!convertExt) {
      res.set('Content-type', tempFrag.mimeType).status(200).send(result);
    } else if (convertExt) {
      //image conversion
      //if mimetype is image, and convert is a present
      // if (tempFrag.mimeType.startsWith('image') && convertExt) {
      //   const result1 = sharp(result).toFile(req.params.id);
      //   res.set('Content-type', tempFrag.mimeType).status(200).send(result1);
      // }
      if (
        (tempFrag.mimeType.startsWith('text/') && convertExt === '.txt') ||
        (fragment.mimeType === 'application/json' && convertExt === '.txt')
      ) {
        // - if all mimetype start with text, and app/json can use .txt to convert to plain/text
        // - set fragment type to text/plain
        // - response with status 200, and set header to current fragment type
        tempFrag.type = 'text/plain';
        res.set('Content-type', tempFrag.mimeType).status(200).send(result);
      }
      //- else if markdown to md. send back original fragment, no change or
      //- html to html send back fragment no change or
      //- application/json to .json, send back original fragment no change or
      else if (
        (tempFrag.mimeType === 'text/markdown' && convertExt === '.md') ||
        (tempFrag.mimeType === 'text/html' && convertExt === '.html') ||
        (tempFrag.mimeType === 'application/json' && convertExt === '.json')
      ) {
        res.set('Content-type', tempFrag.mimeType).status(200).send(result);
      }
      //else if markdown to html
      else if (tempFrag.mimeType === 'text/markdown' && convertExt === '.html') {
        tempFrag.type = 'text/html';
        res
          .set('Content-type', tempFrag.mimeType)
          .status(200)
          .send(md.render(`# ${result}`));
      } else {
        throw new Error('Unsupported type');
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
