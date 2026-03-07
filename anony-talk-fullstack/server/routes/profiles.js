const express = require('express');
const db = require('../db');
const router = express.Router();

// Get profile
router.get('/:userId', (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.params.userId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
});

// Create or update profile
router.put('/:userId', (req, res) => {
  const { avatar, nickname, mood, song, funfact, ghost, theme } = req.body;
  const userId = req.params.userId;

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

  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
  res.json(profile);
});

module.exports = router;
