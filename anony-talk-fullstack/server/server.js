require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const profileRoutes = require('./routes/profiles');
const moodRoutes = require('./routes/mood');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/chat', chatRoutes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`AnonyTalk server running on port ${PORT}`);
});
