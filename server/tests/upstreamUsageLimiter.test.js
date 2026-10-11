const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createUpstreamUsageLimiter } = require('../lib/upstreamUsageLimiter');

test('allows 20 paid requests, then blocks paid upstream calls for that client', () => {
  const allow = createUpstreamUsageLimiter();
  for (let i = 0; i < 20; i += 1) assert.equal(allow('client-a', 1000), true);
  assert.equal(allow('client-a', 1000), false);
  assert.equal(allow('client-b', 1000), true);
});

test('reopens a client window at its expiry', () => {
  const allow = createUpstreamUsageLimiter({ windowMs: 1000, maxCalls: 2 });
  assert.equal(allow('client', 1000), true);
  assert.equal(allow('client', 1001), true);
  assert.equal(allow('client', 1999), false);
  assert.equal(allow('client', 2000), true);
});

test('prevents unbounded client-tracking storage', () => {
  const allow = createUpstreamUsageLimiter({ maxClients: 2 });
  assert.equal(allow('client-a', 0), true);
  assert.equal(allow('client-b', 0), true);
  assert.equal(allow('client-c', 0), false);
  assert.equal(allow('client-c', 60000), true);
});

test('rejects invalid runtime limiter configuration', () => {
  assert.throws(() => createUpstreamUsageLimiter({ maxCalls: -1 }), RangeError);
  assert.throws(() => createUpstreamUsageLimiter({ windowMs: 0 }), RangeError);
  assert.throws(() => createUpstreamUsageLimiter({ maxClients: 1.3 }), RangeError);
});
