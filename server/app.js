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

// Allow only explicitly configured origins. Same-origin requests do not need CORS headers.
const defaultDevelopmentOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

function getAllowedOrigins() {
  if (process.env.CORS_ORIGINS !== undefined) {
    return process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
  }
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') return [];
  return defaultDevelopmentOrigins;
}

const allowedOrigins = getAllowedOrigins();
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
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