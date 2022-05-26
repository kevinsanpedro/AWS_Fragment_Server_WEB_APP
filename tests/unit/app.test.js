//supertest to cover error 404
//this is for line 35 in lab3
const request = require('supertest');

// Get our Express app object
const app = require('../../src/app');

describe('/ health check', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/notfound');
    expect(res.statusCode).toBe(404);
  });
});
