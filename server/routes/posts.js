const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

// Public read-only feed.
router.get('/', (req, res) => {
  const { category } = req.query;
  let posts;
  if (category && category !== 'All') {
    posts = db.prepare('SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC').all(category);
  } else {
    posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  }
  return res.json(posts);
});

router.post('/', requireAuth, (req, res) => {
  const { title, content, category, emoji } = req.body;
  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    return res.status(400).json({ error: 'Minimum 10 characters required' });
  }

  const result = db.prepare(
    'INSERT INTO posts (user_id, title, content, category, emoji) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, title || '', content.trim(), category || 'General', emoji || '💭');

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(post);
});

router.patch('/:id/upvote', requireAuth, (req, res) => {
  const upvote = db.transaction(() => {
    const exists = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
    if (!exists) return { missing: true };

    const inserted = db.prepare(
      'INSERT OR IGNORE INTO post_votes (post_id, user_id) VALUES (?, ?)'
    ).run(req.params.id, req.user.id);

    if (inserted.changes > 0) {
      db.prepare('UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?').run(req.params.id);
    }

    return {
      post: db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id),
      alreadyVoted: inserted.changes === 0,
    };
  })();

  if (upvote.missing) return res.status(404).json({ error: 'Post not found' });
  return res.json({ ...upvote.post, alreadyVoted: upvote.alreadyVoted });
});

module.exports = router;
