const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

function requireOwnUser(req, res, next) {
  if (req.params.userId !== req.user.id) {
    return res.status(403).json({ error: 'You can only access your own profile' });
  }
  return next();
}

// Profile data is private to the authenticated owner.
router.get('/:userId', requireAuth, requireOwnUser, (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  return res.json(profile);
});

router.put('/:userId', requireAuth, requireOwnUser, (req, res) => {
  const { avatar, nickname, mood, song, funfact, ghost, theme } = req.body;
  const userId = req.user.id;
  const existing = db.prepare('SELECT user_id FROM profiles WHERE user_id = ?').get(userId);

  if (existing) {
    db.prepare(`
      UPDATE profiles SET avatar=?, nickname=?, mood=?, song=?, funfact=?, ghost=?, theme=?, updated_at=datetime('now')
      WHERE user_id=?
    `).run(avatar, nickname, mood, song, funfact, ghost ? 1 : 0, theme || 'default', userId);
  } else {
    db.prepare(`
      INSERT INTO profiles (user_id, avatar, nickname, mood, song, funfact, ghost, theme)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, avatar, nickname, mood, song, funfact, ghost ? 1 : 0, theme || 'default');
  }

  return res.json(db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId));
});

module.exports = router;
