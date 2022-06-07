/* eslint-disable no-unused-vars */
//test
//implement test for data/memory/index.js
const res = require('express/lib/response');
const { expectCt } = require('helmet');
const memoryIndex = require('../../src/model/data/memory/index');
const MemoryDB = require('../../src/model/data/memory/memory-db');

describe('index', () => {
  //query
  test('get list of fragment ids/or object for the given user by user return secondary and delete after', async () => {
    //defining array data
    const data1 = { ownerId: 'a', id: 'a', fragment: { value: 1 } };
    const data2 = { ownerId: 'a', id: 'b', fragment: { value: 2 } };
    const data3 = { ownerId: 'a', id: 'c', fragment: { value: 3 } };
    const data4 = { ownerId: 'a', id: 'd', fragment: { value: 4 } };

    await memoryIndex.writeFragment(data1);
    await memoryIndex.writeFragment(data2);
    await memoryIndex.writeFragment(data3);
    await memoryIndex.writeFragment(data4);

    //write array list of fragmentData
    const result = await memoryIndex.listFragments('a');
    expect(Array.isArray(result)).toBe(true);

    //check if memory index is array
    expect(result).toEqual(['a', 'b', 'c', 'd']);
  });

  //query expand to true
  test('get expand query and, look for undefined primary key', async () => {
    //write array list of fragmentData
    const result = await memoryIndex.listFragments('k', true);
    expect(result).toEqual([undefined]);
  });

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
  test('writeFragmentData data return owners id, and id', async () => {
    const result = await memoryIndex.writeFragmentData('a', 'b', {});
    expect(result).toBe(undefined);
  });

  test('delete() all meta and data from memory db', async () => {
    await memoryIndex.deleteFragment('a', 'b');
    expect(await memoryIndex.readFragmentData('a', 'b')).toBe(undefined);
  });
});
