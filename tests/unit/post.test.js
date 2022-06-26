const request = require('supertest');

const app = require('../../src/app');
//un authenticated user

describe('POST /v1/fragments', () => {
  test('authenticate user posting fragment and data', async () => {
    const post = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const get = await request(app)
      .get(`/v1/fragments/${post.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');

    expect(get.statusCode).toBe(200);
    expect(post.body).toEqual(get.body);
  });

  test('unauthenticated user posting fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'wrong_password')
      .set('Content-Type', 'text/plain')
      .send('this is a fragment');

    expect(res.body.error.message).toEqual('Unauthorized');
  });

  test('authorize user posting invalid  type fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'video/ogg')
      .send('This is a fragment');
    expect(res.statusCode).toBe(415);
  });
});
