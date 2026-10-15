const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

function requireOwnUser(req, res, next) {
  if (req.params.userId !== req.user.id) {
    return res.status(403).json({ error: 'You can only access your own mood data' });
  }
  return next();
}

router.get('/:userId', requireAuth, requireOwnUser, (req, res) => {
  const logs = db.prepare(
    "SELECT * FROM mood_logs WHERE user_id = ? AND date >= date('now', '-7 days') ORDER BY date DESC"
  ).all(req.user.id);
  return res.json(logs);
});

router.post('/', requireAuth, (req, res) => {
  const { mood, date } = req.body;
  if (!mood) return res.status(400).json({ error: 'Mood is required' });

  const logDate = date || new Date().toISOString().split('T')[0];
  db.prepare(`
    INSERT INTO mood_logs (user_id, mood, date) VALUES (?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET mood = excluded.mood
  `).run(req.user.id, mood, logDate);

  return res.json({ message: 'Mood logged', mood, date: logDate });
});

router.get('/:userId/challenges', requireAuth, requireOwnUser, (req, res) => {
  const { page } = req.query;
  const challenges = db.prepare(
    'SELECT * FROM challenges WHERE user_id = ? AND page = ?'
  ).all(req.user.id, page || 'general');
  return res.json(challenges);
});

router.post('/challenges', requireAuth, (req, res) => {
  const { challengeId, page, completed } = req.body;
  if (!challengeId) return res.status(400).json({ error: 'Challenge is required' });

  db.prepare(`
    INSERT INTO challenges (user_id, challenge_id, page, completed) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, challenge_id, page) DO UPDATE SET completed = excluded.completed
  `).run(req.user.id, challengeId, page || 'general', completed ? 1 : 0);

  return res.json({ message: 'Challenge updated' });
});

module.exports = router;
