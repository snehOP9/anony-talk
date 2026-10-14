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

// Same-origin requests do not need CORS; only explicitly trusted browser origins do.
const configuredOrigins = process.env.CORS_ORIGINS || process.env.CLIENT_URL || '';
const allowedOrigins = new Set(
  (configuredOrigins || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173,http://127.0.0.1:5173'))
    .split(',').map((origin) => origin.trim()).filter(Boolean)
);
app.use(cors({
  origin: (origin, callback) => callback(null, Boolean(origin && allowedOrigins.has(origin))),
  credentials: true,
}));
const jsonBodyLimit = process.env.JSON_BODY_LIMIT || '32kb';
app.use(express.json({ limit: jsonBodyLimit }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/chat', chatRoutes);

app.use((error, _request, response, next) => {
  if (error?.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Request body too large' });
  }
  return next(error);
});

module.exports = app;