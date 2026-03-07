const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const router = express.Router();

function ageToGroup(age) {
  if (age >= 12 && age <= 19) return 'teen';
  if (age >= 20 && age <= 25) return 'young-adult';
  return null;
}

function createSession(userId, ghostToken = null) {
  const token = uuidv4();
  db.prepare(
    'INSERT INTO sessions (token, user_id, ghost_token) VALUES (?, ?, ?)'
  ).run(token, userId, ghostToken || null);
  return token;
}

// ── Register ─────────────────────────────────────────────────────────────────
router.post('/register', (req, res) => {
  const { username, email, password, age } = req.body;

  if (!username || !email || !password || age === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 12 || ageNum > 25) {
    return res.status(400).json({ message: 'Age must be between 12 and 25.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);
  const age_group = ageToGroup(ageNum);

  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, age, age_group) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, username, email, password_hash, ageNum, age_group);

  const token = createSession(id);

  res.json({
    message: 'Welcome to AnonyTalk! Your safe space is ready.',
    token,
    user: { id, username, email, age: ageNum, ageGroup: age_group },
  });
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createSession(user.id);

  res.json({
    message: 'Welcome back!',
    token,
    user: { id: user.id, username: user.username, email: user.email, age: user.age, ageGroup: user.age_group },
  });
});

// ── Ghost ─────────────────────────────────────────────────────────────────────
router.post('/ghost', (_req, res) => {
  const id = uuidv4();
  const ghostToken = uuidv4();
  const username = `Ghost_${id.slice(0, 6)}`;

  db.prepare(
    'INSERT INTO users (id, username, is_ghost) VALUES (?, ?, 1)'
  ).run(id, username);

  const token = createSession(id, ghostToken);

  res.json({
    token,
    ghostToken,
    user: { id, username, ageGroup: null },
  });
});

// ── Ghost Resume ───────────────────────────────────────────────────────────────
router.post('/ghost/resume', (req, res) => {
  const { ghostToken } = req.body;

  if (!ghostToken) {
    return res.status(400).json({ message: 'Ghost token required.' });
  }

  const session = db.prepare('SELECT * FROM sessions WHERE ghost_token = ?').get(ghostToken);
  if (!session) {
    return res.status(404).json({ message: 'Ghost session not found.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id);
  if (!user) {
    return res.status(404).json({ message: 'Ghost user not found.' });
  }

  const token = createSession(user.id, ghostToken);

  res.json({
    token,
    ghostToken,
    user: { id: user.id, username: user.username, ageGroup: null },
  });
});

module.exports = router;
