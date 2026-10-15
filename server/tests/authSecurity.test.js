const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

process.env.CORS_ORIGINS = 'https://trusted.example';
const app = require('../app');
const db = require('../db');

function createUser() {
  const id = randomUUID();
  const token = randomUUID();
  db.prepare('INSERT INTO users (id, username, email) VALUES (?, ?, ?)').run(id, `security_${id.slice(0, 8)}`, `${id}@example.test`);
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token, id, new Date(Date.now() + 60_000).toISOString()
  );
  return { id, token };
}

function cleanup(user) {
  db.prepare('DELETE FROM post_votes WHERE user_id = ? OR post_id IN (SELECT id FROM posts WHERE user_id = ?)').run(user.id, user.id);
  db.prepare('DELETE FROM posts WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM profiles WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM mood_logs WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM challenges WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
}

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

test('CORS permits only configured browser origins', async () => {
  await withServer(async (baseUrl) => {
    const trusted = await fetch(`${baseUrl}/api/health`, { headers: { Origin: 'https://trusted.example' } });
    const untrusted = await fetch(`${baseUrl}/api/health`, { headers: { Origin: 'https://evil.example' } });
    assert.equal(trusted.headers.get('access-control-allow-origin'), 'https://trusted.example');
    assert.equal(untrusted.headers.get('access-control-allow-origin'), null);
  });
});

test('registration and login normalize email addresses', async (t) => {
  const email = `MixedCase-${randomUUID()}@Example.Test`;
  let userId;
  await withServer(async (baseUrl) => {
    const registration = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: '  Test User  ', email, password: 'test-password-123', age: 21 }),
    });
    assert.equal(registration.status, 200);
    const data = await registration.json();
    userId = data.user.id;
    assert.equal(data.user.email, email.trim().toLowerCase());
    assert.equal(data.user.username, 'Test User');

    const login = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email.toUpperCase(), password: 'test-password-123' }),
    });
    assert.equal(login.status, 200);
    assert.equal((await login.json()).user.email, email.trim().toLowerCase());
  });
  t.after(() => { if (userId) cleanup({ id: userId }); });
});

test('expired sessions are rejected and logout revokes a live session', async (t) => {
  const expired = createUser();
  const live = createUser();
  t.after(() => { cleanup(expired); cleanup(live); });
  db.prepare('UPDATE sessions SET expires_at = ? WHERE token = ?').run('2000-01-01T00:00:00.000Z', expired.token);

  await withServer(async (baseUrl) => {
    const expiredResponse = await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: { authorization: `Bearer ${expired.token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ content: 'This post should not be accepted.' }),
    });
    assert.equal(expiredResponse.status, 401);

    const logout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { authorization: `Bearer ${live.token}` },
    });
    assert.equal(logout.status, 200);

    const afterLogout = await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: { authorization: `Bearer ${live.token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ content: 'This post should not be accepted either.' }),
    });
    assert.equal(afterLogout.status, 401);
  });
});

test('expired ghost resume tokens cannot create new sessions', async () => {
  const user = createUser();
  const ghostToken = randomUUID();
  db.prepare('UPDATE users SET is_ghost = 1 WHERE id = ?').run(user.id);
  db.prepare('UPDATE sessions SET ghost_token = ?, ghost_expires_at = ? WHERE token = ?').run(
    ghostToken, '2000-01-01T00:00:00.000Z', user.token
  );

  try {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/auth/ghost/resume`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ghostToken }),
      });
      assert.equal(response.status, 404);
    });
  } finally {
    cleanup(user);
  }
});
