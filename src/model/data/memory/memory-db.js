//it has all necessary pieces for writing CRUD operation(get,delete, update(put), read)
//this is a lowlevel database that can be used to store the fragments and fragment metadata
//what to do https://youtu.be/U5img3xL_Bg?t=1616

/*
  primary key and secondary key
  "id" : "asdasdas_asdas",
  "ownerId": "0925f997"

    example of metadata note: Metadata is "data that provides information about other data "created"
  "created": "2021-11-02T15:09:50.403Z",
  "updated": "2021-11-02T15:09:50.403Z",
  "type": "text/plain",
  "size": 256
*/
//we will use 2 databse one memory databse for the fragments and one memory database for the fragment metadata
const validateKey = (key) => typeof key === 'string';

class MemoryDB {
  constructor() {
    this.db = {};
  }

  /**
   * Gets a value for the given primaryKey and secondaryKey for more information https://jsdoc.app/tags-param.html
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns Promise<any>
   * 
    primarykey who owns the data, (e.g. ownerID,or email)
    secondarykey is the ID of the fragments
  
   */
  get(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }

    const db = this.db;
    const value = db[primaryKey] && db[primaryKey][secondaryKey];
    return Promise.resolve(value);
  }

  /**
   * Puts a value into the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns Promise
   */
  put(primaryKey, secondaryKey, value) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }

    const db = this.db;
    // Make sure the `primaryKey` exists, or create this is like db.primarykey = primarykey or {}
    db[primaryKey] = db[primaryKey] || {};
    // Add the `value` to the `secondaryKey` this is like db.primarykey.secondary.key = value
    db[primaryKey][secondaryKey] = value;

    //aws will happen over http calls so we are going to  doing a network request, and will take time because of that we need to use asynchronous
    //in other word will return a promise or use await else it will give a bug
    return Promise.resolve();
  }

  /**
   * Queries the list of values (i.e., secondaryKeys) for the given primaryKey.
   * Always returns an Array, even if no items are found.
   * @param {string} primaryKey
   * @returns Promise<any[]>
   */
  query(primaryKey) {
    if (!validateKey(primaryKey)) {
      throw new Error(`primaryKey string is required, got primaryKey=${primaryKey}`);
    }

    // No matter what, we always return an array (even if empty)
    const db = this.db;
    const values = db[primaryKey] && Object.values(db[primaryKey]);
    return Promise.resolve([].concat(values));
  }

  /**
   * Deletes the value with the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns Promise<any[]>
   */
  async del(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }

    // Throw if trying to delete a key that doesn't exist
    if (!(await this.get(primaryKey, secondaryKey))) {
      throw new Error(
        `missing entry for primaryKey=${primaryKey} and secondaryKey=${secondaryKey}`
      );
    }

    const db = this.db;
    delete db[primaryKey][secondaryKey];
    return Promise.resolve();
  }
}

module.exports = MemoryDB;
