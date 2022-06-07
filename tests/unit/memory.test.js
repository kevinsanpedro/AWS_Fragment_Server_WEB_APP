/* eslint-disable no-unused-vars */
//test
//implement test for data/memory/index.js
const res = require('express/lib/response');
const { expectCt } = require('helmet');
const memoryIndex = require('../../src/model/data/memory/index');
const MemoryDB = require('../../src/model/data/memory/memory-db');

describe('index', () => {
  // let dbData;

  // // Each test will get its own, empty database instance
  // beforeEach(() => {
  //   dbData = new memoryIndex();
  // });

  //readFragments
  test('read fragments() return ownerId, and id', async () => {
    const data = { ownerId: 'a', id: 'b', fragment: {} };
    await memoryIndex.writeFragment(data);

    const result = await memoryIndex.readFragment(data.ownerId, data.id);
    expect(result).toEqual(data);
  });

  //writeFragments
  test('write fragments() return nothing', async () => {
    const data = { ownerId: 'a', id: 'b', fragment: {} };
    const result = await memoryIndex.writeFragment(data);
    expect(result).toBe(undefined);
  });

  //readFragmentData
  test('read fragmentData() what we write into the memory index', async () => {
    const data = { value: 123 };

    //this will return a promise
    await memoryIndex.writeFragmentData('a', 'b', data);

    const result = await memoryIndex.readFragmentData('a', 'b');

    expect(result).toEqual(data);
  });

  //writeFragmentData
  test('writeFragmentData data return ownerid, id', async () => {
    const result = await memoryIndex.writeFragmentData('a', 'b', {});
    expect(result).toBe(undefined);
  });

  test('query() returns all owner id with value a', async () => {
    //write array list of fragmentData
    const result = await memoryIndex.listFragments('a');

    //check if memory index is array
    //expect(Array.isArray(result).toBe(true));
    expect(result).toEqual(['b']);
    //check if the result is equal to data we write using fragmentData
    //expect(result).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
  });
});
