const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const db = require('../db');
const app = require('../app');

function createUser() {
  const id = randomUUID();
  const token = randomUUID();
  db.prepare('INSERT INTO users (id, username) VALUES (?, ?)').run(id, `test_${id.slice(0, 8)}`);
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token, id, new Date(Date.now() + 60_000).toISOString()
  );
  return { id, token };
}

function removeUsers(users) {
  const ids = users.map((user) => user.id);
  if (!ids.length) return;
  const placeholders = ids.map(() => '?').join(', ');
  db.prepare(`DELETE FROM post_votes WHERE user_id IN (${placeholders}) OR post_id IN (SELECT id FROM posts WHERE user_id IN (${placeholders}))`).run(...ids, ...ids);
  db.prepare(`DELETE FROM posts WHERE user_id IN (${placeholders})`).run(...ids);
  db.prepare(`DELETE FROM profiles WHERE user_id IN (${placeholders})`).run(...ids);
  db.prepare(`DELETE FROM mood_logs WHERE user_id IN (${placeholders})`).run(...ids);
  db.prepare(`DELETE FROM challenges WHERE user_id IN (${placeholders})`).run(...ids);
  db.prepare(`DELETE FROM sessions WHERE user_id IN (${placeholders})`).run(...ids);
  db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).run(...ids);
}

async function withServer(run) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

function auth(token) {
  return { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
}

test('private mutations reject missing and invalid bearer sessions', async () => {
  await withServer(async (baseUrl) => {
    for (const headers of [{ 'content-type': 'application/json' }, auth('not-a-session')]) {
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: 'This post is long enough.' }),
      });
      assert.equal(response.status, 401);
    }
  });
});

test('post authorship and mood/challenge ownership come from the session', async (t) => {
  const owner = createUser();
  const other = createUser();
  t.after(() => removeUsers([owner, other]));

  await withServer(async (baseUrl) => {
    const postResponse = await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: auth(owner.token),
      body: JSON.stringify({ userId: other.id, content: 'This post is long enough.', title: 'Test' }),
    });
    assert.equal(postResponse.status, 201);
    assert.equal((await postResponse.json()).user_id, owner.id);

    const moodResponse = await fetch(`${baseUrl}/api/mood`, {
      method: 'POST',
      headers: auth(owner.token),
      body: JSON.stringify({ userId: other.id, mood: 'calm' }),
    });
    assert.equal(moodResponse.status, 200);
    assert.equal(db.prepare('SELECT user_id FROM mood_logs WHERE mood = ?').get('calm').user_id, owner.id);

    const challengeResponse = await fetch(`${baseUrl}/api/mood/challenges`, {
      method: 'POST',
      headers: auth(owner.token),
      body: JSON.stringify({ userId: other.id, challengeId: 'daily-test', completed: true }),
    });
    assert.equal(challengeResponse.status, 200);
    assert.equal(db.prepare('SELECT user_id FROM challenges WHERE challenge_id = ?').get('daily-test').user_id, owner.id);
  });
});

test('profile reads and writes cannot cross user boundaries', async (t) => {
  const owner = createUser();
  const other = createUser();
  t.after(() => removeUsers([owner, other]));
  db.prepare('INSERT INTO profiles (user_id, nickname) VALUES (?, ?)').run(other.id, 'Original');

  await withServer(async (baseUrl) => {
    const read = await fetch(`${baseUrl}/api/profiles/${other.id}`, {
      headers: auth(owner.token),
    });
    assert.equal(read.status, 403);

    const update = await fetch(`${baseUrl}/api/profiles/${other.id}`, {
      method: 'PUT',
      headers: auth(owner.token),
      body: JSON.stringify({ nickname: 'Hijacked' }),
    });
    assert.equal(update.status, 403);
    assert.equal(db.prepare('SELECT nickname FROM profiles WHERE user_id = ?').get(other.id).nickname, 'Original');
  });
});

test('duplicate and concurrent upvotes count once per authenticated user', async (t) => {
  const owner = createUser();
  const voter = createUser();
  t.after(() => removeUsers([owner, voter]));
  const inserted = db.prepare(
    'INSERT INTO posts (user_id, title, content, category, emoji) VALUES (?, ?, ?, ?, ?)'
  ).run(owner.id, 'Votes', 'A post for testing duplicate votes.', 'General', '💭');
  const postId = inserted.lastInsertRowid;

  await withServer(async (baseUrl) => {
    const responses = await Promise.all(Array.from({ length: 5 }, () => fetch(
      `${baseUrl}/api/posts/${postId}/upvote`,
      { method: 'PATCH', headers: auth(voter.token) },
    )));
    assert.ok(responses.every((response) => response.status === 200));
    assert.equal(db.prepare('SELECT upvotes FROM posts WHERE id = ?').get(postId).upvotes, 1);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM post_votes WHERE post_id = ? AND user_id = ?').get(postId, voter.id).count, 1);
  });
});

test('upvoting a missing post returns 404 without creating a vote', async (t) => {
  const voter = createUser();
  t.after(() => removeUsers([voter]));
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/posts/999999999/upvote`, {
      method: 'PATCH',
      headers: auth(voter.token),
    });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: 'Post not found' });
  });
});
