/* eslint-disable no-undef */
// Fix this path to point to your project's `memory-db.js` source file../../src/model/data/memory/memory-db'
const MemoryDB = require('../../src/model/data/memory/memory-db');

describe('memory-db', () => {
  let db;

  // Each test will get its own, empty database instance
  beforeEach(() => {
    db = new MemoryDB();
  });

  //this test is to make sure that put is not returning anything
  test('put() returns nothing', async () => {
    const result = await db.put('a', 'b', {});
    expect(result).toBe(undefined);
  });

  test('get() returns what we put() into the db', async () => {
    //define argument
    const data = { value: 123 };
    //call asyncfunction, define(or update) the db model with a,b, and data
    await db.put('a', 'b', data);
    // -
    const result = await db.get('a', 'b'); //primarykey = a, secondarykey = b

    // - expect the result to be equal to the data
    expect(result).toEqual(data);
  });

  test('put() and get() work with Buffers', async () => {
    //buffer is an object that has a whole bunch of different method https://nodejs.org/api/buffer.html
    //https://youtu.be/U5img3xL_Bg?t=1145
    const data = Buffer.from([1, 2, 3]);
    await db.put('a', 'b', data);
    const result = await db.get('a', 'b');
    expect(result).toEqual(data);
  });

  test('get() with incorrect secondaryKey returns nothing', async () => {
    await db.put('a', 'b', 123);
    const result = await db.get('a', 'c');
    expect(result).toBe(undefined);
  });

  test('query() returns empty array', async () => {
    await db.put('b', 'a', { value: 1 });
    await db.put('b', 'b', { value: 2 });
    await db.put('b', 'c', { value: 3 });

    const results = await db.query('a');
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual([]);
  });

  test('del() removes value put() into db', async () => {
    await db.put('a', 'a', { value: 1 });
    expect(await db.get('a', 'a')).toEqual({ value: 1 });
    await db.del('a', 'a');
    expect(await db.get('a', 'a')).toBe(undefined);
  });

  test('del() throws if primaryKey and secondaryKey not in db', () => {
    //this syntax is similar to I expect that when i call db.del('a', 'a') is going to be rejected and once it got rejected it will throw an error
    expect(() => db.del('a', 'a')).rejects.toThrow();
  });

  test('get() expects string keys', () => {
    //if I call get and it doesn't get a string it will throw an error
    expect(async () => await db.get()).rejects.toThrow();
    expect(async () => await db.get(1)).rejects.toThrow();
    expect(async () => await db.get(1, 1)).rejects.toThrow();
  });

  test('put() expects string keys', () => {
    //put expect to get a string
    expect(async () => await db.put()).rejects.toThrow();
    expect(async () => await db.put(1)).rejects.toThrow();
    expect(async () => await db.put(1, 1)).rejects.toThrow();
  });

  test('query() expects string key', () => {
    //query expect to have a string
    expect(async () => await db.query()).rejects.toThrow();
    expect(async () => await db.query(1)).rejects.toThrow();
  });

  test('del() expects string keys', () => {
    //expect to have a string
    expect(async () => await db.del()).rejects.toThrow();
    expect(async () => await db.del(1)).rejects.toThrow();
    expect(async () => await db.del(1, 1)).rejects.toThrow();
  });
});
