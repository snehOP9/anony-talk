const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const app = require('../app');
const db = require('../db');

async function withServer(run) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
}

async function post(base, route, body) {
  const response = await fetch(`${base}/api/auth/${route}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

test('registration stores normalized emails and login accepts case/space variants', async () => {
  const email = `Case-${randomUUID()}@example.test`;
  const normalized = email.toLowerCase();
  try {
    await withServer(async (base) => {
      const registration = await post(base, 'register', { username: 'tester', email: `  ${email}  `, password: 'password123', age: 20 });
      assert.equal(registration.status, 200);
      assert.equal(registration.body.user.email, normalized);
      const duplicate = await post(base, 'register', { username: 'other', email: normalized.toUpperCase(), password: 'password123', age: 20 });
      assert.equal(duplicate.status, 409);
      const login = await post(base, 'login', { email: ` ${email.toUpperCase()} `, password: 'password123' });
      assert.equal(login.status, 200);
      assert.equal(login.body.user.email, normalized);
    });
  } finally {
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(normalized);
    if (user) {
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
      db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
    }
  }
});

test('malformed email/password values return 400 instead of crashing auth handlers', async () => {
  await withServer(async (base) => {
    assert.equal((await post(base, 'register', { username: 'tester', email: {}, password: 123, age: 20 })).status, 400);
    assert.equal((await post(base, 'login', { email: {}, password: {} })).status, 400);
  });
});
