const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/posts',    require('./routes/posts'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/mood',     require('./routes/mood'));
app.use('/api/chat',     require('./routes/chat'));

module.exports = app;
