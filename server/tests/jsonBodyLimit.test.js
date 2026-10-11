const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../app');

async function withServer(run) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test('oversized JSON returns a client-safe 413 response', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'x'.repeat(40 * 1024) }),
    });

    assert.equal(response.status, 413);
    assert.deepEqual(await response.json(), { error: 'Request body too large' });
  });
});

test('normal JSON passes the body parser without a 413', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'hello' }),
    });

    assert.notEqual(response.status, 413);
  });
});
