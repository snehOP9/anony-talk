const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profiles');
const moodRoutes = require('./routes/mood');
const chatRoutes = require('./routes/chat');

const app = express();

// Allow local dev and same-origin Vercel API requests.
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;
