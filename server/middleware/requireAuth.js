const db = require('../db');

function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Authentication required' });

  const session = db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(match[1].trim());
  if (!session) return res.status(401).json({ error: 'Invalid session token' });

  req.user = { id: session.user_id };
  return next();
}

module.exports = requireAuth;
