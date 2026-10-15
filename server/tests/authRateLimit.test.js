const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

async function withServer(run) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('authentication attempts are rate limited and include Retry-After', async () => {
  await withServer(async (baseUrl) => {
    const responses = [];
    for (let i = 0; i < 11; i += 1) {
      responses.push(await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: '', password: '' }),
      }));
    }
    assert.ok(responses.slice(0, 10).every((response) => response.status === 400));
    assert.equal(responses[10].status, 429);
    assert.equal(responses[10].headers.get('retry-after'), '900');
  });
});
