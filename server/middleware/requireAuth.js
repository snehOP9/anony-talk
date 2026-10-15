const db = require('../db');

function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Authentication required' });

  const token = match[1].trim();
  const session = db.prepare(
    "SELECT user_id FROM sessions WHERE token = ? AND expires_at IS NOT NULL AND datetime(expires_at) > datetime('now') AND (ghost_expires_at IS NULL OR datetime(ghost_expires_at) > datetime('now'))"
  ).get(token);
  if (!session) return res.status(401).json({ error: 'Invalid or expired session token' });

  req.user = { id: session.user_id };
  req.sessionToken = token;
  return next();
}

module.exports = requireAuth;
