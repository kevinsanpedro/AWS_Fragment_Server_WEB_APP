const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  //If the request is missing the Authorization header, it should be forbidden
  test('get v1 without credentials', () => request(app).get('/v1/fragments').expect(401));

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

  test('get by valid id with info', async () => {
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

  test('get by valid id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
    expect(result.text).toEqual('This is a fragment');
  });

  test('convert html type to plain txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
    expect(result.text).toEqual('This is a fragment');
  });

  test('convert markdown to html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('delete a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const result = await request(app)
      .delete(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
  });

  test('update a fragment a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const result = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    expect(result.statusCode).toBe(200);
  });

  test('update a fragment with wrong text', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const result = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    expect(result.statusCode).toBe(400);
  });

  test('convert json to text/plain', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
    expect(result.text).toEqual('This is a fragment');
  });

  test('convert text/markdown to text/markdown', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(200);
    expect(result.text).toEqual('This is a fragment');
  });

  test('convert text/plain to text/markdown unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(415);
  });

  test('getting id with wrong info', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}asd/info`)
      .auth('user1@email.com', 'password1');

    expect(result.statusCode).toBe(404);
  });

  test('get by invalid id ', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');

    const result = await request(app)
      .get(`/v1/fragments/${123123}`)
      .auth('user1@email.com', 'password1');

    expect(result.body).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'Page not found',
      },
    });
  });
});
