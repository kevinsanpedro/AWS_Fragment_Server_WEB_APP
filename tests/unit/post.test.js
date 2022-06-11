const request = require('supertest');

const app = require('../../src/app');
//un authenticated user

describe('POST /v1/fragments', () => {
  test('authenticate user posting fragment and data', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  //this has some bug
  // test('unauthenticated user posting fragment', () => {
  //   const res = request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'wrongpassword')
  //     .set('Content-Type', 'text/plain')
  //     .send('this is a fragment');

  //   console.log(res);
  // });

  // test('authorize user posting invalid  type fragment', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'password1')
  //     .set('Content-Type', 'video/ogg')
  //     .send('This is a fragment');
  //   expect(res.statusCode).toBe(415);
  // });
});
