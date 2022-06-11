const { expectCt } = require('helmet');
const request = require('supertest');

const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /v1/fragments', () => {
  //If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticate get by id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.id}`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
    expect(result.text).toEqual('This is a fragment');
  });
  test('authenticate get by id with full info', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.id}/info`)
      .auth('user1@email.com', 'password1');
    expect(result.statusCode).toBe(200);
  });
  test('authenticate get by valid id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.id}`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
    expect(result.text).toEqual('This is a fragment');
  });

  test('authenticate get by invalid id ', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${123123}`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);

    expect(result.body).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'Page not found',
      },
    });
  });

  // test('authenticate get by id and get HTML', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'password1')
  //     .set('Content-Type', 'text/plain')
  //     .send('This is a fragment');

  //   const result = await request(app)
  //     .get(`/v1/fragments/${res.body.id}.html`)
  //     .auth('user1@email.com', 'password1');
  //   // expect(result.statusCode).toBe(201);
  //   // expect(result.text).toEqual('This is a fragment');
  // });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
