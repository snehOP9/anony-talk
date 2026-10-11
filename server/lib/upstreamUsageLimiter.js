const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_UPSTREAM_CALLS = 20;
const DEFAULT_MAX_CLIENTS = 5_000;

function createUpstreamUsageLimiter({
  windowMs = DEFAULT_WINDOW_MS,
  maxCalls = DEFAULT_MAX_UPSTREAM_CALLS,
  maxClients = DEFAULT_MAX_CLIENTS,
} = {}) {
  if (![windowMs, maxCalls, maxClients].every((value) => Number.isSafeInteger(value) && value > 0)) {
    throw new RangeError('Limiter settings must be positive integers.');
  }

  const clients = new Map();

  return function allowUpstreamCall(clientKey, now = Date.now()) {
    for (const [key, state] of clients) {
      if (state.resetAt <= now) clients.delete(key);
    }

    const key = String(clientKey || 'unknown');
    let state = clients.get(key);

    if (!state) {
      if (clients.size >= maxClients) {
        // Fail closed for paid upstream traffic; callers may still receive local support.
        return false;
      }
      state = { used: 0, resetAt: now + windowMs };
      clients.set(key, state);
    }

    if (state.used >= maxCalls) return false;
    state.used += 1;
    return true;
  };
}

module.exports = { createUpstreamUsageLimiter };
