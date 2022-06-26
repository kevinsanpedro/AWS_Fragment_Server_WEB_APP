/**
 * Get a list of fragments for the current user
 */
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model//fragment');
const path = require('node:path');

//disable markdown - used to convert text to html
// var MarkdownIt = require('markdown-it'),
//   md = new MarkdownIt();

module.exports = async (req, res) => {
  let fragment;
  let result;
  //console.log(req.params.id);
  //let query = req.params.id.split('.');

  const convertExt = path.extname(req.params.id); //return .html, .txt
  const fragmentId = path.basename(req.params.id, convertExt); // return fragmentId
  try {
    //get the fragment
    fragment = await Fragment.byId(req.user, fragmentId);

    //if no extention
    if (!convertExt) {
      //return a buffer
      result = await fragment.getData();

      //if the fragment content type is text,
      // -convert raw buffer to plain text
      // -if not respawn with raw buffer
      if (fragment.isText) result = result.toString();

      res.status(200).send(result);
    } else if (convertExt) {
      //if extension exist
      //convert current fragment content type to new type
      //Initial, you only need to support Markdown fragments (.md)
      //converted to HTML (.html) using markdown-it

      res.send('this option is still not available');
    }
  } catch (err) {
    res.send(createErrorResponse(404, 'Page not found'));
  }
};
