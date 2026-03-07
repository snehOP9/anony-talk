const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { anonymousId, encryptionKey } = req.body;

  if (!anonymousId || !encryptionKey) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (anonymousId.length < 3 || encryptionKey.length < 3) {
    return res.status(400).json({ error: 'Fields must be at least 3 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE anonymous_id = ?').get(anonymousId);
  if (existing) {
    return res.status(409).json({ error: 'Identity already exists' });
  }

  const id = uuidv4();
  const hash = bcrypt.hashSync(encryptionKey, 10);

  db.prepare('INSERT INTO users (id, anonymous_id, encryption_key_hash) VALUES (?, ?, ?)').run(id, anonymousId, hash);

  res.json({ message: 'Identity generated successfully', userId: id });
});

// Login
router.post('/login', (req, res) => {
  const { anonymousId, encryptionKey } = req.body;

  if (!anonymousId || !encryptionKey) {
    return res.status(400).json({ error: 'Please fill in both fields' });
  }

  const user = db.prepare('SELECT * FROM users WHERE anonymous_id = ?').get(anonymousId);
  if (!user || !bcrypt.compareSync(encryptionKey, user.encryption_key_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', userId: user.id, anonymousId: user.anonymous_id });
});

module.exports = router;
