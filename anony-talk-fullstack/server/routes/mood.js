const express = require('express');
const db = require('../db');
const router = express.Router();

// Get mood logs for a user (last 7 days)
router.get('/:userId', (req, res) => {
  const logs = db.prepare(
    "SELECT * FROM mood_logs WHERE user_id = ? AND date >= date('now', '-7 days') ORDER BY date DESC"
  ).all(req.params.userId);
  res.json(logs);
});

// Log a mood
router.post('/', (req, res) => {
  const { userId, mood, date } = req.body;
  if (!mood) return res.status(400).json({ error: 'Mood is required' });

  const logDate = date || new Date().toISOString().split('T')[0];

  db.prepare(`
    INSERT INTO mood_logs (user_id, mood, date) VALUES (?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET mood = excluded.mood
  `).run(userId || null, mood, logDate);

  res.json({ message: 'Mood logged', mood, date: logDate });
});

// Get/update challenge state
router.get('/:userId/challenges', (req, res) => {
  const { page } = req.query;
  const challenges = db.prepare(
    'SELECT * FROM challenges WHERE user_id = ? AND page = ?'
  ).all(req.params.userId, page || 'general');
  res.json(challenges);
});

router.post('/challenges', (req, res) => {
  const { userId, challengeId, page, completed } = req.body;

  db.prepare(`
    INSERT INTO challenges (user_id, challenge_id, page, completed) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, challenge_id, page) DO UPDATE SET completed = excluded.completed
  `).run(userId || 'anon', challengeId, page || 'general', completed ? 1 : 0);

  res.json({ message: 'Challenge updated' });
});

module.exports = router;
