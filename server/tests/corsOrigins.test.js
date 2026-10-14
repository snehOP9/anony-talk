const test = require('node:test');
const assert = require('node:assert/strict');

function loadAppWithOrigins(origins) {
  const previous = process.env.CORS_ORIGINS;
  process.env.CORS_ORIGINS = origins;
  delete require.cache[require.resolve('../app')];
  const app = require('../app');
  if (previous === undefined) delete process.env.CORS_ORIGINS;
  else process.env.CORS_ORIGINS = previous;
  return app;
}

async function withServer(app, run) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('CORS grants credentials only to configured origins', async () => {
  const app = loadAppWithOrigins('https://trusted.example');
  await withServer(app, async (base) => {
    const trusted = await fetch(`${base}/api/health`, { headers: { Origin: 'https://trusted.example' } });
    assert.equal(trusted.headers.get('access-control-allow-origin'), 'https://trusted.example');
    assert.equal(trusted.headers.get('access-control-allow-credentials'), 'true');
    const unknown = await fetch(`${base}/api/health`, { headers: { Origin: 'https://unknown.example' } });
    assert.equal(unknown.status, 200);
    assert.equal(unknown.headers.get('access-control-allow-origin'), null);
    const sameOrigin = await fetch(`${base}/api/health`);
    assert.equal(sameOrigin.status, 200);
  });
});
