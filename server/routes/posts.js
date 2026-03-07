const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all posts (with optional category filter)
router.get('/', (req, res) => {
  const { category } = req.query;
  let posts;
  if (category && category !== 'All') {
    posts = db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC').all(category);
  } else {
    posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  }
  res.json(posts);
});

// Create a post
router.post('/', (req, res) => {
  const { userId, title, content, category, emoji } = req.body;

  if (!content || content.trim().length < 10) {
    return res.status(400).json({ error: 'Minimum 10 characters required' });
  }

  const result = db.prepare(
    'INSERT INTO posts (user_id, title, content, category, emoji) VALUES (?, ?, ?, ?, ?)'
  ).run(userId || null, title || '', content.trim(), category || 'General', emoji || '💭');

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(post);
});

// Upvote a post
router.patch('/:id/upvote', (req, res) => {
  db.prepare('UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?').run(req.params.id);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

module.exports = router;
