/* eslint-disable no-undef */
// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  // eslint-disable-next-line no-unused-vars
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    let date = new Date(Date.now()).toISOString();
    let error = 0;

    if (!ownerId) error++;
    if (!type || !type.includes('text')) error++; //to update
    if (typeof size !== 'number' || size < 0) error++;
    if (!id) id = nanoid(); // to update

    if (error > 0) {
      Promise.throw();
    } else {
      this.ownerId = ownerId;
      this.id = id;
      this.type = type;
      this.size = size;
      this.created = date;
      this.updated = date;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    const result = await listFragments(ownerId, expand);
    return Promise.resolve(result);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const result = await readFragment(ownerId, id);
    if (!result) return Promise.throw();
    return Promise.resolve(result);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's idn
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = new Date(Date.now()).toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  //not done
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    //TO DO
    if (!data) return Promise.throw();
    this.size = Buffer.byteLength(data);
    this.updated = new Date(Date.now()).toISOString();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.includes('text');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    return contentType.format({ type: ['text/plain'] });
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return value.includes('text');
  }
}

module.exports.Fragment = Fragment;
